// scripts/script-cadastro.js  (versão simplificada e estável)
function register() {
  const nome__register = document.querySelector("#nome__register");
  const email__register = document.querySelector("#email__register");
  const senha__register = document.querySelector("#senha__register");
  const confirm__register = document.querySelector("#confirm__register");
  const msgError = document.querySelector("#msgError");
  const msgSuccess = document.querySelector("#msgSuccess");

  msgError.style.display = "none";
  msgSuccess.style.display = "none";

  const nome = nome__register.value.trim();
  const email = email__register.value.trim();
  const senha = senha__register.value.trim();
  const confirm = confirm__register.value.trim();

  // Verifica campos
  if (!nome || !email || !senha || !confirm) {
    msgError.style.display = "block";
    msgError.innerHTML = "Preencha todos os campos.";
    return;
  }

  if (senha !== confirm) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    senha__register.value = "";
    confirm__register.value = "";
    senha__register.focus();
    return;
  }

  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
  const userExists = listaUser.some(u => u.emailUser === email);

  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // Cria novo usuário
  const newUser = {
    nomeUser: nome,
    emailUser: email,
    senhaUser: senha,
  };

  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  // Mostra sucesso e redireciona após 3 segundos
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  
  // Limpa campos
  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

// Evita submit do form e ativa o botão
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const btn = document.getElementById("botaoCadastrar");

  if (form) form.addEventListener("submit", (e) => e.preventDefault());
  if (btn) btn.addEventListener("click", (e) => {
    e.preventDefault();
    register();
  });
});
