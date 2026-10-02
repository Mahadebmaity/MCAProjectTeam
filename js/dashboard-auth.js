(async function () {
  const token = localStorage.getItem("authToken");
  const welcomeName = document.getElementById("welcomeUserName");
  const logoutButton = document.getElementById("logoutButton");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Session validation failed");
    }

    localStorage.setItem("authUser", JSON.stringify(data.user));

    if (welcomeName) {
      welcomeName.textContent = data.user.name;
    }
  } catch (error) {
    console.error(error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.location.href = "login.html";
    return;
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.location.href = "login.html";
    });
  }
})();
