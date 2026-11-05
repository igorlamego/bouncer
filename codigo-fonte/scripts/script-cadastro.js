function register() {
  const nome__register = document.querySelector("#nome__register");
  const email__register = document.querySelector("#email__register");
  const senha__register = document.querySelector("#senha__register");
  const confirm__register = document.querySelector("#confirm__register");
  const msgError = document.querySelector("#msgError");
  const msgSuccess = document.querySelector("#msgSuccess");

  // Get structured data from localStorage
  const data = getData();
  const listaUser = data.users;

  // Reset messages
  msgError.style.display = "none";
  msgSuccess.style.display = "none";

  // Validate all fields
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

  // Email format
  const email = email__register.value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msgError.style.display = "block";
    msgError.innerHTML = "Digite um email válido.";
    return;
  }

  // Password rules
  const senha = senha__register.value.trim();
  const senhaValida =
    senha.length >= 6 &&
    /[0-9]/.test(senha) &&
    /[a-zA-Z]/.test(senha);

  // Confirm password
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

  // Check if email already exists
  const userExists = listaUser.some(
    (user) => (user.emailUser || "").toLowerCase() === email
  );

  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Email já cadastrado.";
    return;
  }

  // Create the user object with a unique ID (ADD ROLE FIELD)
  const newUser = {
    id: makeId(),
    nomeUser: nome__register.value.trim(),
    emailUser: email,
    senhaUser: senha,
    events: [] 
  };

  // Add user to list and save back
  listaUser.push(newUser);
  saveData(data);

  // Success message
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = "Cadastro realizado com sucesso!";

  // Clear inputs
  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";

  // Redirect after short delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

// Press Enter to submit
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    register();
  }
});
