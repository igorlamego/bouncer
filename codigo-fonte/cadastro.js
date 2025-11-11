// scripts/script-cadastro.js (versão final — compatível com login atual)
function register() {
  const nomeEl = document.getElementById("nome__register");
  const emailEl = document.getElementById("email__register");
  const senhaEl = document.getElementById("senha__register");
  const confEl  = document.getElementById("confirm__register");
  const msgErr  = document.getElementById("msgError");
  const msgOk   = document.getElementById("msgSuccess");

  // limpa mensagens
  msgErr.style.display = "none";
  msgOk.style.display  = "none";
  msgErr.innerHTML = "";
  msgOk.innerHTML  = "";

  // valores normalizados
  const nome   = (nomeEl.value  || "").trim();
  const email  = ((emailEl.value || "").trim()).toLowerCase();
  const senha  = (senhaEl.value || "").trim();
  const confirm= (confEl.value  || "").trim();

  // validações básicas
  if (!nome || !email || !senha || !confirm) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Preencha todos os campos.";
    return;
  }
  if (senha !== confirm) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "As senhas não coincidem.";
    senhaEl.value = "";
    confEl.value  = "";
    senhaEl.focus();
    return;
  }

  // lê ou cria objeto 'data' do localStorage
  let data = JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };
  if (!Array.isArray(data.users)) data.users = [];

  // verifica duplicado
  const exists = data.users.some(u => (u.emailUser || "").toLowerCase() === email);
  if (exists) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // adiciona novo usuário
  const newUser = { nomeUser: nome, emailUser: email, senhaUser: senha };
  data.users.push(newUser);
  localStorage.setItem("data", JSON.stringify(data));

  // também mantém compatibilidade com listaUser (caso outra parte use)
  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  // sucesso + redirecionamento em 3 s
  msgOk.style.display = "block";
  msgOk.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  nomeEl.value = emailEl.value = senhaEl.value = confEl.value = "";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

// evita submit e liga o botão
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const btn  = document.getElementById("botaoCadastrar");
  if (form) form.addEventListener("submit", e => e.preventDefault());
  if (btn)  btn.addEventListener("click", e => { e.preventDefault(); register(); });
});
