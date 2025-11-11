// scripts/script-cadastro.js (v22 — só cadastro; compatível com login atual)
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

  // valores digitados (exatos, apenas sem espaços nas pontas)
  const nome    = (nomeEl.value  || "").trim();
  const email   = (emailEl.value || "").trim();   // sem .toLowerCase(): login compara literal
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

  // Helpers de dados (usam data.js se disponível)
  const safeGetData  = (typeof getData  === "function")
    ? () => getData()
    : () => JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };

  const safeSaveData = (typeof saveData === "function")
    ? (d) => saveData(d)
    : (d) => localStorage.setItem("data", JSON.stringify(d));

  // carrega estrutura principal
  let data = safeGetData();
  if (!Array.isArray(data.users)) data.users = [];

  // checa duplicado (case-insensitive para evitar e-mails duplicados só por maiúscula/minúscula)
  const exists = data.users.some(u => String(u.emailUser || "").trim().toLowerCase() === email.toLowerCase());
  if (exists) {
    msgErr.style.display = "block";
    msgErr.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  // objeto no formato que o login usa
  const newUser = { nomeUser: nome, emailUser: email, senhaUser: senha };

  // salva onde o login lê
  data.users.push(newUser);
  safeSaveData(data);

  // compatibilidade com listaUser (se outra parte usa)
  try {
    const lista = JSON.parse(localStorage.getItem("listaUser")) || [];
    lista.push(newUser);
    localStorage.setItem("listaUser", JSON.stringify(lista));
  } catch (_) {}

  // feedback + redirecionamento
  msgOk.style.display = "block";
  msgOk.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  document.getElementById("registerForm")?.reset();

  // log de confirmação (abra o console para ver)
  try {
    const check = (safeGetData().users || []).find(u => u.emailUser === email && u.senhaUser === senha);
    console.log("📦 Gravado em data.users:", !!check, check);
  } catch (_) {}

  setTimeout(() => { window.location.href = "login.html"; }, 3000);
}

// evita submit nativo e liga botão
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm")?.addEventListener("submit", e => e.preventDefault());
  document.getElementById("botaoCadastrar")?.addEventListener("click", e => { e.preventDefault(); register(); });
});
