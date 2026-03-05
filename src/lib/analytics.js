import mixpanel from 'mixpanel-browser'

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN
let initialized = false

export function initAnalytics() {
  if (!TOKEN || initialized) return
  mixpanel.init(TOKEN, {
    track_pageview: false,       // we handle page views manually
    persistence: 'localStorage',
    ignore_dnt: false,
  })
  initialized = true
}

// ── Identify (call after login) ──────────────────────────────────────────────
export function identifyUser(userId, traits = {}) {
  if (!initialized) return
  mixpanel.identify(userId)
  if (Object.keys(traits).length) mixpanel.people.set(traits)
}

// ── Reset (call on sign out) ─────────────────────────────────────────────────
export function resetUser() {
  if (!initialized) return
  mixpanel.reset()
}

// ── Track event ──────────────────────────────────────────────────────────────
export function track(event, props = {}) {
  if (!initialized) return
  mixpanel.track(event, props)
}

// ── Page view ────────────────────────────────────────────────────────────────
export function trackPageView(path) {
  if (!initialized) return
  mixpanel.track('Page Viewed', { path })
}
