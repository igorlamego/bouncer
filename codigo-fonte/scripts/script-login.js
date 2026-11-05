function login() {
  const email__login = document.querySelector("#email__login");
  const senha__login = document.querySelector("#senha__login");
  const msgError = document.querySelector("#msgError");

  // Get the data from localStorage through data.js
  const data = getData();
  const listaUser = data.users;

  // Find user match
  const email = email__login.value.trim().toLowerCase();
  const userValid = listaUser.find(
    (item) =>
      email === (item.emailUser || "").toLowerCase() &&
      senha__login.value === item.senhaUser
  );

  if (userValid && email && senha__login.value) {
    // Create a token for session
    const token =
      Math.random().toString(16).substr(2) +
      Math.random().toString(16).substr(2);

    // Save session data
    localStorage.setItem("token", token);
    // Never keep the password in the session object
    const { senhaUser, ...sessionUser } = userValid;
    localStorage.setItem("loggedIn", JSON.stringify(sessionUser));
    localStorage.setItem("nome", JSON.stringify(userValid.nomeUser));

    // Redirect
    window.location.href = "dashboard.html";
  
  } else {
    // Error message
    msgError.style.display = "block";
    msgError.innerHTML = "Email ou senha incorretos";
    email__login.classList.add("error__class");
    senha__login.classList.add("error__class");
    senha__login.value = "";
    senha__login.focus();
  }
}

// Allow pressing Enter to login
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    login();
  }
});
