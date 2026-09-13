const form = document.getElementById('contact-form');
const statusBox = document.getElementById('form-status');
const yearNode = document.getElementById('year');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (form && statusBox) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      statusBox.textContent = 'Sending message...';
    statusBox.className = 'form-status';
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
      });

        const contentType = response.headers.get('content-type') || '';
        const result = contentType.includes('application/json') ? await response.json() : {};

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to send message.');
      }

      statusBox.textContent = result.message || 'Thanks! Your message was sent successfully.';
      statusBox.classList.add('success');
      form.reset();
    } catch (error) {
      const mailtoLink = `mailto:bbek75059@gmail.com?subject=${encodeURIComponent('Portfolio contact')}&body=${encodeURIComponent(`Name: ${payload.name || ''}\nEmail: ${payload.email || ''}\n\nMessage:\n${payload.message || ''}`)}`;
      const fallbackLink = document.createElement('a');
      fallbackLink.href = mailtoLink;
      fallbackLink.textContent = 'Open email app';
      fallbackLink.className = 'status-link';
      statusBox.replaceChildren(
        document.createTextNode('The online form is temporarily unavailable.'),
        document.createTextNode(' '),
        fallbackLink
      );
      statusBox.classList.add('error');
    } finally {
      window.clearTimeout(timeoutId);
      if (submitButton) submitButton.disabled = false;
    }
  });
}
