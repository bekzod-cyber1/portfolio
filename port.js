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

      statusBox.textContent = 'Sending message...';
    statusBox.className = 'form-status';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Contact response:', result);

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to send message.');
      }

      statusBox.textContent = result.message || 'Thanks! Your message was sent successfully.';
      statusBox.classList.add('success');
      form.reset();
    } catch (error) {
      console.error('Contact submit error:', error);
      const mailtoLink = `mailto:bbek75059@gmail.com?subject=${encodeURIComponent('Portfolio contact')}&body=${encodeURIComponent(`Name: ${payload.name || ''}\nEmail: ${payload.email || ''}\n\nMessage:\n${payload.message || ''}`)}`;
      statusBox.textContent = 'The form is ready to be sent. Please use your email app to contact me directly.';
      statusBox.classList.add('error');
      window.open(mailtoLink, '_blank');
    }
  });
}
