const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

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

loginForm.addEventListener("submit", function (event) {
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

  if (rememberMe.checked) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  message.style.color = "green";
  message.textContent = "Login successful!";

  console.log({
    email,
    password
  });
});