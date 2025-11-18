// ===== Inicialização (debug) =====
console.log("JS cadastro-participantes carregado ✔");

// ===== Chave do Local Storage =====
const STORAGE_KEY = "participantes";

// ===== Função para pegar os eventos cadastrados =====
function getEventos() {
  try {
    return JSON.parse(localStorage.getItem("eventos")) || [];
  } catch {
    return [];
  }
}

// ===== Pega o formulário =====
const form = document.querySelector("form");

// Seleciona campos com fallback
let nome, email, telefone, cpf, categoria, comprovante, observacoes, selectEvento;

if (form) {
  const groups = form.querySelectorAll(":scope > div");

  nome        = document.getElementById("nome")        || groups[0]?.querySelector("input");
  email       = document.getElementById("email")       || groups[1]?.querySelector("input[type='email'], input");
  telefone    = document.getElementById("telefone")    || groups[2]?.querySelector("input");
  cpf         = document.getElementById("cpf")         || groups[3]?.querySelector("input");
  categoria   = document.getElementById("categoria")   || groups[4]?.querySelector("select");
  comprovante = document.getElementById("comprovante") || groups[5]?.querySelector("input[type='file']");
  observacoes = document.getElementById("observacoes") || form.querySelector(".descricao textarea");

  // Campo de evento
  selectEvento = document.getElementById("evento");

  console.log("Form encontrado?", !!form);
} else {
  console.warn("⚠️ Formulário não encontrado.");
}

// ===== Helpers de Storage =====
function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ===== Preencher <select id="evento"> =====
if (selectEvento) {
  const eventos = getEventos();

  if (eventos.length === 0) {
    selectEvento.innerHTML = `<option value="">Nenhum evento cadastrado</option>`;
  } else {
    selectEvento.innerHTML = eventos
      .map(ev => `<option value="${ev.id}">${ev.nome}</option>`)
      .join("");
  }
}

// ===== Validação simples =====
function validar() {
  if (!nome || !nome.value.trim()) {
    alert("Informe o nome do participante.");
    nome?.focus();
    return false;
  }
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    alert("E-mail inválido.");
    email.focus();
    return false;
  }
  if (selectEvento && !selectEvento.value) {
    alert("Selecione o evento.");
    selectEvento.focus();
    return false;
  }
  return true;
}

// ===== Resumo do arquivo (apenas metadados) =====
function resumirArquivo(file) {
  if (!file) return null;
  return { name: file.name, type: file.type, size: file.size };
}

// ===== Submit =====
if (form) {
  form.noValidate = true;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validar()) return;

    const file = (comprovante?.files?.[0]) || null;

    const participante = {
      id: "P-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6).toUpperCase(),

      // VÍNCULO DO EVENTO
      eventoId: selectEvento?.value || "",

      nome: nome?.value?.trim() || "",
      email: email?.value?.trim() || "",
      telefone: telefone?.value?.trim() || "",
      cpf: cpf?.value?.trim() || "",
      categoria: categoria?.value || "",
      comprovante: resumirArquivo(file),
      observacoes: observacoes?.value?.trim() || "",
      criadoEm: new Date().toISOString()
    };

    const lista = getAll();
    lista.push(participante);
    setAll(lista);

    console.log("Participante salvo:", participante);

    alert("✅ Participante cadastrado com sucesso!");
    form.reset();
  });

  console.log("Listener de submit conectado ✔");
}

// ===== Máscaras =====
if (telefone) {
  telefone.addEventListener("input", () => {
    let v = telefone.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) telefone.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) telefone.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else telefone.value = v;
  });
}

if (cpf) {
  cpf.addEventListener("input", () => {
    let v = cpf.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) cpf.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
    else if (v.length > 6) cpf.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    else if (v.length > 3) cpf.value = `${v.slice(0,3)}.${v.slice(3)}`;
    else cpf.value = v;
  });
}
