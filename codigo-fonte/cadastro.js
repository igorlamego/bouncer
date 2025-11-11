// scripts/script-cadastro.js (compatível com login atual que usa getData()->data.users)
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

  // validações
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

  // 1) listaUser (compatibilidade antiga)
  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
  if (listaUser.some(u => String(u.emailUser).toLowerCase() === email)) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // 2) data.users (o que o login usa via getData())
  let data;
  try {
    data = (typeof getData === "function") ? getData() : (JSON.parse(localStorage.getItem("data")) || {});
  } catch {
    data = JSON.parse(localStorage.getItem("data")) || {};
  }
  data.users = Array.isArray(data.users) ? data.users : [];

  if (data.users.some(u => String(u.emailUser).toLowerCase() === email)) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // novo usuário
  const newUser = { nomeUser: nome, emailUser: email, senhaUser: senha };

  // grava nas DUAS fontes
  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  data.users.push(newUser);
  if (typeof saveData === "function") {
    saveData(data);                 // usa helper do seu data.js
  } else {
    localStorage.setItem("data", JSON.stringify(data)); // fallback
  }

  // sucesso + redireciona em 3s
  msgOk.style.display = "block";
  msgOk.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  nomeEl.value = emailEl.value = senhaEl.value = confEl.value = "";

  setTimeout(() => { window.location.href = "login.html"; }, 3000);
}

// evita submit nativo e liga o botão
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const btn  = document.getElementById("botaoCadastrar");
  if (form) form.addEventListener("submit", e => e.preventDefault());
  if (btn)  btn.addEventListener("click", e => { e.preventDefault(); register(); });
});
