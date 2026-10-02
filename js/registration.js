const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  message.style.color = "red";

  if (name.length < 3) {
    message.textContent = "Name must be at least 3 characters.";
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    message.textContent = "Phone number must be exactly 10 digits.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Creating account...";
  message.textContent = "";

  try {
    const response = await fetch(`${window.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Registration failed.";
      return;
    }

    message.style.color = "green";
    message.textContent = "Registration successful! Redirecting to login...";
    form.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Unable to connect to the backend server.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Register";
  }
});

function togglePassword(inputId, element) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    element.textContent = "Hide";
  } else {
    input.type = "password";
    element.textContent = "Show";
  }
}
