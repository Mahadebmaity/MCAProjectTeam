const forgotForm = document.getElementById("forgotForm");
const message = document.getElementById("message");
const submitButton = forgotForm.querySelector('button[type="submit"]');

forgotForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  message.style.color = "red";

  if (newPassword.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Resetting...";
  message.textContent = "";

  try {
    const response = await fetch(`${window.API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Password reset failed.";
      return;
    }

    message.style.color = "green";
    message.textContent = "Password reset successful! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Unable to connect to the backend server.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Reset Password";
  }
});

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}
