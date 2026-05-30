// Happy Place — Contact Form API (Vercel Serverless)
// Sends form submissions via Resend to happyplacemoires@gmail.com

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml({ name, phone, email, childAge, interest, message }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#718096;font-size:14px;width:140px;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#2D3748;font-size:14px;vertical-align:top;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="el">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#90C4AE;padding:28px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Happy Place</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 20px;font-size:18px;font-weight:bold;color:#2D3748;">Νέο μήνυμα από το site</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
              ${row('Όνομα', escapeHtml(name))}
              ${row('Τηλέφωνο', escapeHtml(phone))}
              ${row('Email', escapeHtml(email))}
              ${row('Ηλικία παιδιού', childAge ? escapeHtml(childAge) : '—')}
              ${row('Ενδιαφέρον', interest ? escapeHtml(interest) : '—')}
              ${row('Μήνυμα', message ? `<span style="white-space:pre-wrap;">${escapeHtml(message)}</span>` : '—')}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f7f4;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
            <span style="font-size:12px;color:#999;">Αποστάλθηκε από <a href="https://happyplace.gr" style="color:#90C4AE;text-decoration:none;">happyplace.gr</a></span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, phone, email, childAge, interest, message } = req.body ?? {};

  if (!name || !phone || !email) {
    return res.status(400).json({ ok: false, error: 'Τα πεδία Όνομα, Τηλέφωνο και Email είναι υποχρεωτικά.' });
  }

  const html = buildEmailHtml({ name, phone, email, childAge, interest, message });
  const subject = `Νέο μήνυμα από το site — ${interest ? escapeHtml(interest) : 'Γενική Πληροφόρηση'}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'Happy Place <noreply@happyplace.gr>',
        to:      ['happyplacemoires@gmail.com'],
        subject,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ ok: false, error: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
