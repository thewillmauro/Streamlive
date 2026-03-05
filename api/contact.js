import nodemailer from 'nodemailer';

const NOTIFY_EMAIL   = 'will@strmlive.com';
const NOTIFY_SOURCES = ['contact_sales', 'contact_sales_billing'];

const ALLOWED_ORIGINS = [
  'https://www.strmlive.com',
  'https://strmlive.com',
  'https://strmlive.vercel.app',
];

// ── Simple in-memory rate limiter (per Vercel function instance) ──────────────
const rateMap = new Map();
const RATE_WINDOW_MS = 60_000;  // 1 minute
const RATE_MAX = 5;             // 5 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_MAX) return true;
  return false;
}

// ── Input sanitizer: strip HTML tags, trim, and limit length ─────────────────
function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // ── CORS: restrict to known origins ─────────────────────────────────────────
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const SHEET_URL = process.env.SHEET_WEBHOOK_URL;
  if (!SHEET_URL) {
    console.error('SHEET_WEBHOOK_URL not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const body = req.body || {};

  // ── Input validation ───────────────────────────────────────────────────────
  const email = sanitize(body.email, 254);
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const payload = {
    firstName: sanitize(body.firstName, 100),
    lastName:  sanitize(body.lastName, 100),
    email,
    phone:     sanitize(body.phone, 20).replace(/[^\d\s\-\+\(\)]/g, ''),
    store:     sanitize(body.store, 200),
    platforms: sanitize(body.platforms, 200),
    message:   sanitize(body.message, 2000),
    source:    sanitize(body.source, 50) || 'contact_sales',
    timestamp: new Date().toISOString(),
    page:      sanitize(body.page, 200),
  };

  // ── 1. Write to Google Sheets ─────────────────────────────────────────────
  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Sheet webhook error');
  }

  // ── 2. Email notification for Contact Sales ───────────────────────────────
  if (NOTIFY_SOURCES.includes(payload.source)) {
    const smtpUser = process.env.NOTIFY_SMTP_USER;
    const smtpPass = process.env.NOTIFY_SMTP_PASS;
    const smtpHost = process.env.NOTIFY_SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.NOTIFY_SMTP_PORT || '587');

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        const sourceLabel = payload.source === 'contact_sales_billing'
          ? 'Billing page (in-app)' : 'Marketing landing page';

        const platformList = payload.platforms
          ? payload.platforms.split(',').map(p => p.trim()).filter(Boolean).join(', ')
          : 'Not specified';

        const formattedTime = new Date(payload.timestamp).toLocaleString('en-US', {
          timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short',
        });

        // HTML-escape all user-provided values for email
        const safeName = escapeHtml(`${payload.firstName} ${payload.lastName}`);
        const safeEmail = escapeHtml(payload.email);
        const safePhone = escapeHtml(payload.phone);
        const safeStore = escapeHtml(payload.store);
        const safePlatforms = escapeHtml(platformList);
        const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br>');
        const safeFirstName = escapeHtml(payload.firstName);

        await transporter.sendMail({
          from:    `"Streamlive Leads" <${smtpUser}>`,
          to:      NOTIFY_EMAIL,
          subject: `New Contact Sales — ${payload.firstName} ${payload.lastName}${payload.store ? ` (${payload.store})` : ''}`,
          html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#06060e;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#0a0a15;border:1px solid #14142a;border-radius:16px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 32px;">
    <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;">New Contact Sales Inquiry</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.75);">${escapeHtml(formattedTime)} ET &middot; via ${escapeHtml(sourceLabel)}</div>
  </div>
  <div style="padding:28px 32px;">
    <div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">Contact Details</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:9px 0;border-bottom:1px solid #14142a;width:36%;font-size:12px;font-weight:600;color:#6b7280;">Name</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${safeName}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Email</td><td style="padding:9px 0;border-bottom:1px solid #14142a;"><a href="mailto:${safeEmail}" style="color:#7c3aed;font-size:13px;text-decoration:none;">${safeEmail}</a></td></tr>
      ${safePhone ? `<tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Phone</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${safePhone}</td></tr>` : ''}
      ${safeStore ? `<tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Store / Agency</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${safeStore}</td></tr>` : ''}
      <tr><td style="padding:9px 0;font-size:12px;font-weight:600;color:#6b7280;">Platforms</td><td style="padding:9px 0;font-size:13px;color:#e2e8f0;">${safePlatforms}</td></tr>
    </table>
    ${safeMessage ? `
    <div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Message</div>
    <div style="background:#06060e;border:1px solid #14142a;border-radius:10px;padding:14px 16px;font-size:13px;color:#9ca3af;line-height:1.65;margin-bottom:24px;">${safeMessage}</div>` : ''}
    <a href="mailto:${safeEmail}?subject=Re: Your Streamlive Inquiry" style="display:block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">
      Reply to ${safeFirstName} &rarr;
    </a>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #14142a;text-align:center;">
    <div style="font-size:11px;color:#374151;">Streamlive &middot; Contact Sales Notification</div>
  </div>
</div></body></html>`,
          text: `New Contact Sales\n\nName: ${payload.firstName} ${payload.lastName}\nEmail: ${payload.email}\nPhone: ${payload.phone || 'Not provided'}\nStore: ${payload.store || 'Not provided'}\nPlatforms: ${platformList}\nSource: ${sourceLabel}\n\nMessage:\n${payload.message || 'None'}\n\nTime: ${formattedTime} ET`,
        });
      } catch (emailErr) {
        console.error('Email notification error');
      }
    }
  }

  return res.status(200).json({ success: true });
}
