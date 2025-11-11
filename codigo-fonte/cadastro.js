function register() {
  const nomeEl = document.getElementById("nome__register");
  const emailEl = document.getElementById("email__register");
  const senhaEl = document.getElementById("senha__register");
  const confEl  = document.getElementById("confirm__register");
  const msgErr  = document.getElementById("msgError");
  const msgOk   = document.getElementById("msgSuccess");

  msgErr.style.display = "none";
  msgOk.style.display  = "none";
  msgErr.innerHTML = "";
  msgOk.innerHTML  = "";

  const nome    = (nomeEl.value  || "").trim();
  const email   = ((emailEl.value || "").trim()).toLowerCase();
  const senha   = (senhaEl.value || "").trim();
  const confirm = (confEl.value  || "").trim();

  if (!nome || !email || !senha || !confirm) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Preencha todos os campos.";
    return;
  }
  if (senha !== confirm) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "As senhas não coincidem.";
    senhaEl.value = ""; confEl.value = ""; senhaEl.focus();
    return;
  }

  let data = JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };
  if (!Array.isArray(data.users)) data.users = [];

  if (data.users.some(u => (u.emailUser || "").toLowerCase() === email)) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  const newUser = { nomeUser: nome, emailUser: email, senhaUser: senha };
  data.users.push(newUser);
  localStorage.setItem("data", JSON.stringify(data));

  // (opcional) manter compatibilidade antiga:
  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
  listaUser.push(newUser);
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  msgOk.style.display = "block";
  msgOk.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  nomeEl.value = emailEl.value = senhaEl.value = confEl.value = "";

  setTimeout(() => { window.location.href = "login.html"; }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const btn  = document.getElementById("botaoCadastrar");
  if (form) form.addEventListener("submit", e => e.preventDefault());
  if (btn)  btn.addEventListener("click", e => { e.preventDefault(); register(); });
});
