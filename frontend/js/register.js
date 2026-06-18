const form = document.getElementById('registerForm');
const message = document.getElementById('registerMessage');
const apiBaseUrl = window.location.origin === 'null' ? 'http://localhost:3000' : window.location.origin;

function showMessage(text, kind) {
  message.textContent = text;
  message.hidden = false;
  message.className = `alert ${kind === 'error' ? 'alert-error' : 'alert-success'}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!name || !email || !password || !confirmPassword) {
    showMessage('Fill in all fields.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Passwords do not match.', 'error');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Creating account...';

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed.');
    }

    showMessage('Account created. Redirecting to login...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Create account';
  }
});