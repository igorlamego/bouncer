function register() {
  const nome_register = document.querySelector("#nome_register");
  const email_register = document.querySelector("#email_register");
  const senha_register = document.querySelector("#senha_register");
  const confirm_register = document.querySelector("#confirm_register"); // new confirm input
  const msgError = document.querySelector("#msgError");
  const msgSuccess = document.querySelector("#msgSuccess");

  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];

  msgError.style.display = "none";
  msgError.innerHTML = "";
  msgSuccess.style.display = "none";
  msgSuccess.innerHTML = "";

  // validate all fields
  if (
    nome__register.value.trim() === "" ||
    email__register.value.trim() === "" ||
    senha__register.value.trim() === "" ||
    confirm__register.value.trim() === ""
  ) {
    msgError.style.display = "block";
    msgError.innerHTML = "Preencha todos os campos.";
    msgSuccess.style.display = "none";
    return;
  }

  // password validation
  const senha = senha__register.value.trim();
  const senhaValida =
    senha.length >= 6 &&
    /[0-9]/.test(senha) &&
    /[a-zA-Z]/.test(senha);

  // confirm password check
  if (senha_register.value.trim() !== confirm_register.value.trim()) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    msgSuccess.style.display = "none";
    senha__register.value = "";
    confirm__register.value = "";
    senha__register.focus();
    return;
  }


  if (!senhaValida) {
    msgError.style.display = "block";
    msgError.innerHTML =
      "A senha deve ter pelo menos 6 caracteres e incluir letras e números.";
    msgSuccess.style.display = "none";
    return;
  }

  // check if email or CPF already exists
  const userExists = listaUser.some(
    (user) =>
      user.emailUser === email__register.value.trim()
  );

  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Email ou CPF já cadastrado.";
    msgSuccess.style.display = "none";
    return;
  }

  // create and save user
  const newUser = {
    nomeUser: nome__register.value.trim(),
    emailUser: email__register.value.trim(),
    senhaUser: senha,
  };

  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  // success message
  msgError.style.display = "none";
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = "Cadastro realizado com sucesso!";

  // clear inputs
  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";

  // optional redirect after delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

// allow pressing ENTER to submit
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    register();
  }
});
