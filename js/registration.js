const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
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

  message.style.color = "green";
  message.textContent = "Registration successful!";

  console.log({
    name,
    email,
    phone,
    password
  });

  form.reset();
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