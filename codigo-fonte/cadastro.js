// scripts/script-cadastro.js

(function () {
  // Fallbacks caso data.js ainda não tenha carregado por algum motivo
  const safeGetData = (typeof getData === "function") ? getData : () => {
    return JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };
  };
  const safeSaveData = (typeof saveData === "function") ? saveData : (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };
  const safeMakeId = (typeof makeId === "function") ? makeId : () => {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  };

  // Seletores (batendo com o HTML)
  const nomeInput    = document.querySelector("#nome__register");
  const emailInput   = document.querySelector("#email__register");
  const senhaInput   = document.querySelector("#senha__register");
  const confirmInput = document.querySelector("#confirm__register");
  const msgError     = document.querySelector("#msgError");
  const msgSuccess   = document.querySelector("#msgSuccess");

  function showError(texto) {
    if (msgSuccess) { msgSuccess.style.display = "none"; msgSuccess.textContent = ""; }
    if (msgError)   { msgError.style.display = "block"; msgError.textContent = texto; }
  }
  function showSuccess(texto) {
    if (msgError)   { msgError.style.display = "none"; msgError.textContent = ""; }
    if (msgSuccess) { msgSuccess.style.display = "block"; msgSuccess.textContent = texto; }
  }

  function validateEmail(email) {
    // Regex simples e suficiente para front
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  window.register = function register() {
    const nome  = (nomeInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const senha = (senhaInput?.value || "").trim();
    const conf  = (confirmInput?.value || "").trim();

    // Limpa mensagens
    if (msgError)   { msgError.style.display = "none"; msgError.textContent = ""; }
    if (msgSuccess) { msgSuccess.style.display = "none"; msgSuccess.textContent = ""; }

    // Validações básicas
    if (!nome || !email || !senha || !conf) {
      showError("Preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      showError("Informe um email válido.");
      return;
    }
    const senhaValida = senha.length >= 6 && /[0-9]/.test(senha) && /[a-zA-Z]/.test(senha);
    if (!senhaValida) {
      showError("A senha deve ter pelo menos 6 caracteres e incluir letras e números.");
      return;
    }
    if (senha !== conf) {
      showError("As senhas não coincidem.");
      if (senhaInput)   senhaInput.value = "";
      if (confirmInput) confirmInput.value = "";
      senhaInput?.focus();
      return;
    }

    // Integra com data.js (onde o login lê)
    const data = safeGetData();

    const jaExiste = (data.users || []).some(u => (u.emailUser || "").toLowerCase() === email.toLowerCase());
    if (jaExiste) {
      showError("Email já cadastrado.");
      return;
    }

    const novoUsuario = {
      id: safeMakeId(),
      nomeUser: nome,
      emailUser: email,
      senhaUser: senha,
      role: "user"
    };

    data.users = data.users || [];
    data.users.push(novoUsuario);
    safeSaveData(data);

    showSuccess("Cadastro realizado com sucesso!");

    // Limpa campos
    if (nomeInput)    nomeInput.value = "";
    if (emailInput)   emailInput.value = "";
    if (senhaInput)   senhaInput.value = "";
    if (confirmInput) confirmInput.value = "";

    // Redireciona para login
    setTimeout(() => { window.location.href = "login.html"; }, 1200);
  };

  // ENTER envia
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      window.register();
    }
  });

  // Se preferir, também liga no clique do link/botão (âncora)
  const botao = document.querySelector("#botaoCadastrar");
  if (botao) botao.addEventListener("click", (e) => { e.preventDefault(); window.register(); });
})();
