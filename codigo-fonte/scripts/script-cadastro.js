function register() {
  const nome__register = document.querySelector("#nome__register");
  const email__register = document.querySelector("#email__register");
  const senha__register = document.querySelector("#senha__register");
  const confirm__register = document.querySelector("#confirm__register");
  const msgError = document.querySelector("#msgError");
  const msgSuccess = document.querySelector("#msgSuccess");

  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];

  msgError.style.display = "none";
  msgError.innerHTML = "";
  msgSuccess.style.display = "none";
  msgSuccess.innerHTML = "";

  if (
    nome__register.value.trim() === "" ||
    email__register.value.trim() === "" ||
    senha__register.value.trim() === "" ||
    confirm__register.value.trim() === ""
  ) {
    msgError.style.display = "block";
    msgError.innerHTML = "Preencha todos os campos.";
    return;
  }

  const senha = senha__register.value.trim();
  const senhaValida =
    senha.length >= 6 && /[0-9]/.test(senha) && /[a-zA-Z]/.test(senha);

  if (senha__register.value.trim() !== confirm__register.value.trim()) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    senha__register.value = "";
    confirm__register.value = "";
    senha__register.focus();
    return;
  }

  if (!senhaValida) {
    msgError.style.display = "block";
    msgError.innerHTML =
      "A senha deve ter pelo menos 6 caracteres e incluir letras e números.";
    return;
  }

  const userExists = listaUser.some(
    (user) => user.emailUser === email__register.value.trim()
  );

  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Email já cadastrado.";
    return;
  }

  const newUser = {
    nomeUser: nome__register.value.trim(),
    emailUser: email__register.value.trim(),
    senhaUser: senha,
  };

  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  msgError.style.display = "none";
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = "Cadastro realizado com sucesso!";

  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    register();
  }
});
