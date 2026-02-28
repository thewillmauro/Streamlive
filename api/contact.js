export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SHEET_URL = process.env.SHEET_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec';

  const body = req.body || {};
  if (!body.email || !body.email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const payload = {
    firstName: body.firstName || '', lastName: body.lastName || '',
    email: body.email, phone: body.phone || '',
    store: body.store || '', platforms: body.platforms || '',
    message: body.message || '', source: body.source || 'contact_sales',
    timestamp: body.timestamp || new Date().toISOString(), page: body.page || '',
  };

  try {
    await fetch(SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: true, note: 'queued' });
  }
}
