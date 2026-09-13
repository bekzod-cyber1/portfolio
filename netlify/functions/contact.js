const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, message: 'Method not allowed.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { ok: false, message: 'Invalid request body.' });
  }

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();

  if (
    !name || name.length > 120 ||
    !email || email.length > 254 || !emailPattern.test(email) ||
    !message || message.length > 5000
  ) {
    return jsonResponse(400, { ok: false, message: 'Please provide a valid name, email, and message.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(500, { ok: false, message: 'Contact service is not configured.' });
  }

  const recipient = process.env.CONTACT_TO_EMAIL || 'bbek75059@gmail.com';
  const sender = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        html: `<h2>New portfolio contact</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`
      })
    });
  } catch {
    return jsonResponse(502, { ok: false, message: 'Unable to send the message right now.' });
  }

  if (!response.ok) {
    return jsonResponse(502, { ok: false, message: 'Unable to send the message right now.' });
  }

  return jsonResponse(200, { ok: true, message: 'Thanks! Your message was sent successfully.' });
};
