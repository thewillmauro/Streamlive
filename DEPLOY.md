# Streamlive — Deployment Guide

> Gets strmlive.com live in ~10 minutes.
> Stack: Vite + React → Vercel (free tier is fine for now)

---

## Step 1 — Install dependencies locally (optional sanity check)

```bash
cd strmlive
npm install
npm run dev        # opens http://localhost:5173
```

You should see the landing page at `/` and the prototype at `/app`.

---

## Step 2 — Push to GitHub

1. Go to **github.com → New repository**
2. Name it `strmlive` — set to **Private**
3. Run these commands in the `strmlive/` folder:

```bash
git init
git add .
git commit -m "Initial prototype deploy"
git remote add origin https://github.com/YOUR_USERNAME/strmlive.git
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

1. Go to **vercel.com** → Sign up / Log in (free)
2. Click **Add New → Project**
3. Import your `strmlive` GitHub repo
4. Vercel will auto-detect it's a Vite project — **no config needed**
5. Click **Deploy**

You'll get a URL like `strmlive.vercel.app` in about 60 seconds.

---

## Step 4 — Connect strmlive.com

### In Vercel:
1. Go to your project → **Settings → Domains**
2. Click **Add Domain** → type `strmlive.com`
3. Also add `www.strmlive.com`
4. Vercel will show you the DNS records to add

### At your domain registrar (wherever you bought strmlive.com):
Add these DNS records:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 76.76.21.21              |
| CNAME | www  | cname.vercel-dns.com     |

DNS propagates in 1–60 minutes (usually under 5).

---

## Step 5 — Verify

- `strmlive.com` → landing page with early access signup
- `strmlive.com/app` → full interactive prototype
- SSL certificate is auto-provisioned by Vercel ✓

---

## Routes

| URL                  | What it shows                         |
|----------------------|---------------------------------------|
| `strmlive.com`       | Coming-soon landing with email capture |
| `strmlive.com/app`   | Full Streamlive prototype (all screens) |

---

## Future: switching from prototype to real app

When you're ready to build the real Next.js app (STREAMLIVE_KICKOFF_PROMPT.md):

1. Run the kickoff prompt in Claude Code — it scaffolds the full stack
2. Point the `main` branch to the new Next.js app
3. The Vercel deployment stays the same — just push to GitHub

---

## File structure

```
strmlive/
├── index.html                    ← HTML entry
├── package.json                  ← Vite + React deps
├── vite.config.js                ← Build config
├── vercel.json                   ← SPA routing + cache headers
└── src/
    ├── main.jsx                  ← React root
    ├── App.jsx                   ← Router: / → Landing, /app → Prototype
    └── StreamlivePrototype.jsx   ← Full interactive prototype
```
