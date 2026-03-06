#!/usr/bin/env node
/**
 * Reads git log and generates src/changelog-entries.json
 * Runs automatically before each Vite build (and thus every Vercel deploy).
 *
 * Only meaningful, user-facing changes make it to the changelog.
 * Internal fixes, build errors, redeploys, and iteration noise are filtered out.
 *
 * To force a commit into the changelog, prefix with:
 *   [changelog] Your message here
 *
 * Otherwise, the script auto-classifies based on commit message patterns.
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'changelog-entries.json')

// Try to unshallow if needed (Vercel does shallow clones by default)
try { execSync('git fetch --unshallow', { stdio: 'ignore' }) } catch {}

const raw = execSync(
  'git log --pretty=format:"%H|%ai|%s" --no-merges',
  { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
).trim()

if (!raw) {
  writeFileSync(OUT, JSON.stringify([]), 'utf-8')
  process.exit(0)
}

// ── Always skip these ──────────────────────────────────────────────────────
const SKIP = [
  /^Trigger redeploy/i,
  /^Merge /i,
  /^Initial deploy$/i,
  /^Latest updates$/i,
  /^Restore /i,
  /^Remove Sentry test/i,
  /^Add temporary Sentry/i,
  /^Remove em dash/i,
]

// ── Only INCLUDE commits matching these patterns (unless [changelog] tagged) ─
const INCLUDE = [
  /^\[changelog\]/i,             // Explicit tag — always include
  /^Add /i,                      // New features
  /^Feature:/i,                  // New features (alt prefix)
  // Major improvements (must have a colon or substantive description)
  /^(?!Fix)(?!Remove)(?!Rename).{20,}/,  // Non-fix, non-remove, 20+ chars = likely substantive
]

// ── Even if included above, reject these noisy patterns ────────────────────
const REJECT = [
  /^Fix /i,                      // All fixes filtered by default
  /^fix:/i,
  /^Remove /i,                   // Removals are cleanup, not user-facing
  /^Rename /i,                   // Renames are internal refactors
  /em.dash/i,
  /build error/i,
  /blank screen/i,
  /crash$/i,
  /hoisting/i,
  /hooks/i,
  /template literal/i,
  /parse error/i,
  /^Smooth out/i,
  /^Wire /i,
  /^Switch to /i,
  /^Clean /i,
  /^Pricing cleanup/i,
  /^Signal icon/i,
  /^Mobile cursor/i,
  /^Viewer counter resets/i,
  /enterprise update$/i,
  /enterprise fixes/i,
  /^producer role$/i,
  /^Products start/i,
]

function shouldInclude(msg) {
  // [changelog] tag always wins
  if (/^\[changelog\]/i.test(msg)) return true
  // Check reject list first
  if (REJECT.some(re => re.test(msg))) return false
  // Must match an include pattern
  return INCLUDE.some(re => re.test(msg))
}

function shouldSkip(msg) {
  return SKIP.some(re => re.test(msg))
}

// ── Classification ─────────────────────────────────────────────────────────

function classifyCommit(msg) {
  if (/^Add |^Feature:|^\[changelog\].*add/i.test(msg)) return { type: '\u2726', kind: 'new' }
  return { type: '\u25C8', kind: 'improved' }
}

function tagForGroup(items) {
  const hasNew = items.some(i => i._kind === 'new')
  if (hasNew) return { tag: 'New', tagColor: '#10b981' }
  return { tag: 'Improved', tagColor: '#7c3aed' }
}

function weekLabel(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (dt) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}, ${monday.getFullYear()}`
}

function cleanMessage(msg) {
  // Strip [changelog] prefix
  let m = msg.replace(/^\[changelog\]\s*/i, '')
  // Strip "Feature: " prefix for cleaner display
  m = m.replace(/^Feature:\s*/i, '')
  return m
}

// ── Parse & group ──────────────────────────────────────────────────────────

const lines = raw.split('\n')
const grouped = new Map()
const seen = new Set()

for (const line of lines) {
  const parts = line.split('|')
  const date = parts[1]
  const msg = parts.slice(2).join('|')

  if (shouldSkip(msg)) continue
  if (!shouldInclude(msg)) continue

  // Deduplicate identical messages
  const key = msg.toLowerCase().trim()
  if (seen.has(key)) continue
  seen.add(key)

  const week = weekLabel(date)
  if (!grouped.has(week)) grouped.set(week, [])

  const { type, kind } = classifyCommit(msg)
  grouped.get(week).push({ type, text: cleanMessage(msg), date: date.split(' ')[0], _kind: kind })
}

// ── Build output ───────────────────────────────────────────────────────────

const entries = []
let vMinor = grouped.size

for (const [month, items] of grouped) {
  // Skip months with no meaningful items
  if (items.length === 0) { vMinor--; continue }

  const { tag, tagColor } = tagForGroup(items)

  entries.push({
    version: `v0.${vMinor}`,
    date: month,
    tag,
    tagColor,
    items: items.map(({ type, text, date }) => ({ type, text, date })),
  })
  vMinor--
}

writeFileSync(OUT, JSON.stringify(entries, null, 2), 'utf-8')
console.log(`[changelog] Generated ${entries.length} entries from ${lines.length} commits → src/changelog-entries.json`)
