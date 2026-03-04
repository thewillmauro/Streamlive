// api/contact.js — Vercel Serverless Function
// Receives contact/sales form submissions, writes to Google Sheets,
// and sends an email notification to will@vantagemode.com for sales inquiries.

import nodemailer from 'nodemailer';

const NOTIFY_EMAIL   = 'will@strmlive.com';
const NOTIFY_SOURCES = ['contact_sales', 'contact_sales_billing'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SHEET_URL = process.env.SHEET_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbwgOLHc642bZ-iHn5djlMWE4zqUHd06apowDVVj8Nk_96w-xal6QjSMyc6W_aYRm-ePrw/exec';

  const body = req.body || {};
  if (!body.email || !body.email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const payload = {
    firstName: body.firstName || '',
    lastName:  body.lastName  || '',
    email:     body.email,
    phone:     body.phone     || '',
    store:     body.store     || '',
    platforms: body.platforms || '',
    message:   body.message   || '',
    source:    body.source    || 'contact_sales',
    timestamp: body.timestamp || new Date().toISOString(),
    page:      body.page      || '',
  };

  // ── 1. Write to Google Sheets ─────────────────────────────────────────────
  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Sheet webhook error:', err);
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

        await transporter.sendMail({
          from:    `"Streamlive Leads" <${smtpUser}>`,
          to:      NOTIFY_EMAIL,
          subject: `🚀 New Contact Sales — ${payload.firstName} ${payload.lastName}${payload.store ? ` (${payload.store})` : ''}`,
          html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#06060e;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#0a0a15;border:1px solid #14142a;border-radius:16px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 32px;">
    <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;">🚀 New Contact Sales Inquiry</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.75);">${formattedTime} ET · via ${sourceLabel}</div>
  </div>
  <div style="padding:28px 32px;">
    <div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">Contact Details</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:9px 0;border-bottom:1px solid #14142a;width:36%;font-size:12px;font-weight:600;color:#6b7280;">Name</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${payload.firstName} ${payload.lastName}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Email</td><td style="padding:9px 0;border-bottom:1px solid #14142a;"><a href="mailto:${payload.email}" style="color:#7c3aed;font-size:13px;text-decoration:none;">${payload.email}</a></td></tr>
      ${payload.phone ? `<tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Phone</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${payload.phone}</td></tr>` : ''}
      ${payload.store ? `<tr><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:12px;font-weight:600;color:#6b7280;">Store / Agency</td><td style="padding:9px 0;border-bottom:1px solid #14142a;font-size:13px;color:#e2e8f0;">${payload.store}</td></tr>` : ''}
      <tr><td style="padding:9px 0;font-size:12px;font-weight:600;color:#6b7280;">Platforms</td><td style="padding:9px 0;font-size:13px;color:#e2e8f0;">${platformList}</td></tr>
    </table>
    ${payload.message ? `
    <div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Message</div>
    <div style="background:#06060e;border:1px solid #14142a;border-radius:10px;padding:14px 16px;font-size:13px;color:#9ca3af;line-height:1.65;margin-bottom:24px;">${payload.message.replace(/\n/g,'<br>')}</div>` : ''}
    <a href="mailto:${payload.email}?subject=Re: Your Streamlive Enterprise Inquiry" style="display:block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">
      Reply to ${payload.firstName} →
    </a>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #14142a;text-align:center;">
    <div style="font-size:11px;color:#374151;">Streamlive · Contact Sales Notification</div>
  </div>
</div></body></html>`,
          text: `New Contact Sales\n\nName: ${payload.firstName} ${payload.lastName}\nEmail: ${payload.email}\nPhone: ${payload.phone || 'Not provided'}\nStore: ${payload.store || 'Not provided'}\nPlatforms: ${platformList}\nSource: ${sourceLabel}\n\nMessage:\n${payload.message || 'None'}\n\nTime: ${formattedTime} ET`,
        });

        console.log(`Notification sent to ${NOTIFY_EMAIL}`);
      } catch (emailErr) {
        console.error('Email notification error:', emailErr);
      }
    } else {
      console.warn('NOTIFY_SMTP_USER or NOTIFY_SMTP_PASS not set — skipping email notification');
    }
  }

  return res.status(200).json({ success: true });
}
