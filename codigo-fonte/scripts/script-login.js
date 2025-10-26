function login() {
  const email__login = document.querySelector("#email__login");
  const senha__login = document.querySelector("#senha__login");
  const msgError = document.querySelector("#msgError");

  const listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];

  const userValid = listaUser.find(
    (item) => email__login.value === item.emailUser && senha__login.value === item.senhaUser
  );

  if (userValid && email__login.value && senha__login.value) {
    const token = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2);

    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", JSON.stringify(userValid));
    localStorage.setItem("nome", JSON.stringify(userValid.nomeUser));

    window.location.href = "dashboard.html";
    
  } else {
    msgError.style.display = "block";
    msgError.innerHTML = "Email ou senha incorretos";
    email__login.classList.add("error__class");
    senha__login.classList.add("error__class");
    senha__login.value = "";
    senha__login.focus();
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    login();
  }
});
