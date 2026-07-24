const form = document.getElementById('contact-form');
const statusBox = document.getElementById('form-status');

if (form && statusBox) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    statusBox.textContent = 'Sending...';
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

      statusBox.textContent = result.message;
      statusBox.classList.add('success');
      form.reset();
    } catch (error) {
      console.error('Contact submit error:', error);
      statusBox.textContent = error.message || 'Something went wrong.';
      statusBox.classList.add('error');
    }
  });
}
