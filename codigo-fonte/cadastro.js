function register() {
  const nome__register = document.querySelector("#nome__register");
  const email__register = document.querySelector("#email__register");
  const senha__register = document.querySelector("#senha__register");
  const confirm__register = document.querySelector("#confirm__register");
  const msgError = document.querySelector("#msgError");
  const msgSuccess = document.querySelector("#msgSuccess");

  // obtém dados do localStorage
  let data = getData();
  let listaUser = data.users;

  // limpa mensagens
  msgError.style.display = "none";
  msgSuccess.style.display = "none";
  msgError.innerHTML = "";
  msgSuccess.innerHTML = "";

  // valida campos vazios
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

  // valida senha
  const senha = senha__register.value.trim();
  const senhaValida =
    senha.length >= 6 &&
    /[0-9]/.test(senha) &&
    /[a-zA-Z]/.test(senha);

  if (!senhaValida) {
    msgError.style.display = "block";
    msgError.innerHTML =
      "A senha deve ter pelo menos 6 caracteres e incluir letras e números.";
    return;
  }

  // confirma senhas
  if (senha__register.value.trim() !== confirm__register.value.trim()) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    senha__register.value = "";
    confirm__register.value = "";
    senha__register.focus();
    return;
  }

  // verifica se e-mail já existe
  const userExists = listaUser.some(
    (user) => user.emailUser === email__register.value.trim()
  );

  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Email já cadastrado.";
    return;
  }

  // cria e salva novo usuário
  const newUser = {
    nomeUser: nome__register.value.trim(),
    emailUser: email__register.value.trim(),
    senhaUser: senha,
  };

  listaUser.push(newUser);
  data.users = listaUser;
  saveData(data);

  // sucesso visual
  msgError.style.display = "none";
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = `
    ✅ Cadastro realizado com sucesso!<br>
    Redirecionando para o login...
  `;
  msgSuccess.style.transition = "opacity 0.6s ease";
  msgSuccess.style.opacity = "1";

  // desativa botão
  const botao = document.getElementById("botaoCadastrar");
  if (botao) {
    botao.disabled = true;
    botao.style.opacity = "0.6";
    botao.style.cursor = "not-allowed";
  }

  // limpa campos
  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";

  // redireciona com atraso
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}

// garante clique e enter
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("botaoCadastrar");
  const form = document.getElementById("registerForm");

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof window.register === "function") window.register();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof window.register === "function") window.register();
    });
  }
});
