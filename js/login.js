const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const submitButton = loginForm.querySelector('button[type="submit"]');

togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Show";
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const savedEmail = localStorage.getItem("rememberedEmail");

  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
  }
});

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  message.style.color = "red";

  if (email === "") {
    message.textContent = "Please enter your email.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";
  message.textContent = "";

  try {
    const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Login failed.";
      return;
    }

    if (rememberMe.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));

    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Unable to connect to the backend server.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
  }
});
