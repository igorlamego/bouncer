// Cadastro local: salva em localStorage.listaUser
function register() {
  const nome__register    = document.querySelector("#nome__register");
  const email__register   = document.querySelector("#email__register");
  const senha__register   = document.querySelector("#senha__register");
  const confirm__register = document.querySelector("#confirm__register");
  const msgError          = document.querySelector("#msgError");
  const msgSuccess        = document.querySelector("#msgSuccess");

  // mensagens off
  msgError.style.display = "none";
  msgSuccess.style.display = "none";
  msgError.innerHTML = "";
  msgSuccess.innerHTML = "";

  // dados existentes
  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];

  // validações básicas
  if (
    !nome__register.value.trim() ||
    !email__register.value.trim() ||
    !senha__register.value.trim() ||
    !confirm__register.value.trim()
  ) {
    msgError.style.display = "block";
    msgError.innerHTML = "Preencha todos os campos.";
    return;
  }

  const senha = senha__register.value.trim();
  const senhaValida = senha.length >= 6 && /[0-9]/.test(senha) && /[a-zA-Z]/.test(senha);
  if (!senhaValida) {
    msgError.style.display = "block";
    msgError.innerHTML = "A senha deve ter pelo menos 6 caracteres e incluir letras e números.";
    return;
  }

  if (senha__register.value.trim() !== confirm__register.value.trim()) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    senha__register.value = "";
    confirm__register.value = "";
    senha__register.focus();
    return;
  }

  const email = email__register.value.trim();
  const userExists = listaUser.some(u => u.emailUser === email);
  if (userExists) {
    msgError.style.display = "block";
    msgError.innerHTML = "Email já cadastrado.";
    return;
  }

  // salva novo usuário
  const newUser = {
    nomeUser:  nome__register.value.trim(),
    emailUser: email,
    senhaUser: senha,
  };
  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  // sucesso + link para login (sem redirecionar automático)
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = `
    ✅ Cadastro realizado com sucesso!<br>
    <a href="login.html" style="color:#2d2a55;font-weight:600;text-decoration:none;">
      Clique aqui para realizar o login
    </a>.
  `;

  // desativa botão e limpa campos
  const botao = document.getElementById("botaoCadastrar");
  if (botao) {
    botao.disabled = true;
    botao.style.opacity = "0.6";
    botao.style.cursor = "not-allowed";
  }
  nome__register.value = "";
  email__register.value = "";
  senha__register.value = "";
  confirm__register.value = "";
}

// listeners de segurança
document.addEventListener("DOMContentLoaded", () => {
  const btn  = document.getElementById("botaoCadastrar");
  const form = document.getElementById("registerForm");
  if (form) form.addEventListener("submit", (e) => { e.preventDefault(); });
  if (btn)  btn.addEventListener("click", (e) => {
    e.preventDefault();
    register();
  });
});

// Permite Enter chamar register() sem enviar form
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    register();
  }
});
