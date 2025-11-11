// scripts/script-cadastro.js (v17)

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function register() {
  const msgError   = document.getElementById("msgError");
  const msgSuccess = document.getElementById("msgSuccess");

  // pega valores com fallback robusto
  const nome   = getVal("nome__register");
  const email  = getVal("email__register");
  const senha  = getVal("senha__register");
  const confirm= getVal("confirm__register");

  // (debug leve no console, ajuda a diagnosticar se algum veio vazio)
  console.log("[cadastro] vals:", { nome, email, senhaLen: senha.length, confirmLen: confirm.length });

  // limpa mensagens
  msgError.style.display = "none";
  msgSuccess.style.display = "none";
  msgError.innerHTML = "";
  msgSuccess.innerHTML = "";

  // validação
  if (!nome || !email || !senha || !confirm) {
    msgError.style.display = "block";
    msgError.innerHTML = "Preencha todos os campos.";
    return;
  }

  if (senha !== confirm) {
    msgError.style.display = "block";
    msgError.innerHTML = "As senhas não coincidem.";
    const sEl = document.getElementById("senha__register");
    const cEl = document.getElementById("confirm__register");
    if (sEl) sEl.value = "";
    if (cEl) cEl.value = "";
    if (sEl) sEl.focus();
    return;
  }

  // carrega/salva
  let listaUser = JSON.parse(localStorage.getItem("listaUser")) || [];
  const existe = listaUser.some(u => u.emailUser === email);
  if (existe) {
    msgError.style.display = "block";
    msgError.innerHTML = "Este e-mail já está cadastrado.";
    return;
  }

  listaUser.push({ nomeUser: nome, emailUser: email, senhaUser: senha });
  localStorage.setItem("listaUser", JSON.stringify(listaUser));

  // sucesso + redirecionamento em 3s
  msgSuccess.style.display = "block";
  msgSuccess.innerHTML = "✅ Cadastro realizado com sucesso!<br>Você será redirecionado para a página de login...";
  
  // limpa campos visualmente
  const ids = ["nome__register","email__register","senha__register","confirm__register"];
  ids.forEach(i => { const el = document.getElementById(i); if (el) el.value = ""; });

  setTimeout(() => { window.location.href = "login.html"; }, 3000);
}

// listeners à prova de falha
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const btn  = document.getElementById("botaoCadastrar");
  if (form) form.addEventListener("submit", e => e.preventDefault());
  if (btn)  btn.addEventListener("click", e => { e.preventDefault(); register(); });
});

// Enter não envia form
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); register(); }
});
