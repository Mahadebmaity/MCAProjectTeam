const forgotForm =
  document.getElementById("forgotForm");

const message =
  document.getElementById("message");

forgotForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const newPassword =
      document
        .getElementById("newPassword")
        .value;

    const confirmPassword =
      document
        .getElementById("confirmPassword")
        .value;

    const savedEmail =
      localStorage.getItem(
        "registeredEmail"
      );

    message.style.color = "red";

    if (!savedEmail) {

      message.textContent =
        "No registered account found.";

      return;
    }

    if (email !== savedEmail) {

      message.textContent =
        "This email is not registered.";

      return;
    }

    if (newPassword.length < 6) {

      message.textContent =
        "Password must be at least 6 characters.";

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {

      message.textContent =
        "Passwords do not match.";

      return;
    }

    localStorage.setItem(
      "registeredPassword",
      newPassword
    );

    message.style.color = "green";

    message.textContent =
      "Password reset successful! Redirecting to login...";

    setTimeout(function () {

      window.location.href =
        "login.html";

    }, 1500);
  }
);

function togglePassword(
  inputId,
  button
) {

  const input =
    document.getElementById(inputId);

  if (
    input.type === "password"
  ) {

    input.type = "text";

    button.textContent = "Hide";

  } else {

    input.type = "password";

    button.textContent = "Show";
  }
}