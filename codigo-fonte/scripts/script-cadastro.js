// scripts/script-cadastro.js (v21 — só cadastro, compatível com login atual)

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
  const nome    = (nomeEl.value  || "").trim();
  const email   = ((emailEl.value || "").trim()).toLowerCase();
  const senha   = (senhaEl.value || "").trim();
  const confirm = (confEl.value  || "").trim();

  // validações
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

  // helpers de dados (usam data.js se existir)
  const safeGetData  = (typeof getData  === "function")
    ? () => getData()
    : () => JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };

  const safeSaveData = (typeof saveData === "function")
    ? (d) => saveData(d)
    : (d) => localStorage.setItem("data", JSON.stringify(d));

  // carrega estrutura principal
  let data = safeGetData();
  if (!Array.isArray(data.users)) data.users = [];

  // e-mail já cadastrado?
  const exists = data.users.some(u => String(u.emailUser || "").toLowerCase() === email);
  if (exists) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // monta usuário no formato que o login espera
  const newUser = { nomeUser: nome, emailUser: email, senhaUser: senha };

  // grava onde o login lê
  data.users.push(newUser);
  safeSaveData(data);

  // compatibilidade (se outra parte do site usa listaUser)
  try {
    const listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
    listaUser.push(newUser);
    localStorage.setItem("listaUser", JSON.stringify(listaUser));
  } catch (_) {}

  // sucesso + redirecionamento
  msgOk.style.display = "block";
  msgOk.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  document.getElementById("registerForm")?.reset();

  // diagnóstico discreto (opcional)
  try {
    const check = safeGetData().users.find(u => u.emailUser === email && u.senhaUser === senha);
    console.log("📦 Gravado em data.users:", !!check, check);
  } catch (_) {}

  setTimeout(() => { window.location.href = "login.html"; }, 3000);
}

// evita submit nativo e liga o botão
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm")?.addEventListener("submit", e => e.preventDefault());
  document.getElementById("botaoCadastrar")?.addEventListener("click", e => { e.preventDefault(); register(); });
});
