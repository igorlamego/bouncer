// ===== Inicialização (debug) =====
console.log("JS cadastro-participantes carregado ✔");

// ===== Chave do Local Storage =====
const STORAGE_KEY = "participantes";

// Pega o formulário (o primeiro da página)
const form = document.querySelector("form");

// Seleciona campos com fallback (funciona com/sem IDs)
let nome, email, telefone, cpf, categoria, comprovante, observacoes;
if (form) {
  const groups = form.querySelectorAll(":scope > div"); // cada linha do formulário
  // Ordem esperada:
  // 0: Nome (input text)
  // 1: E-mail (input email)
  // 2: Telefone (input text)
  // 3: CPF (input text)
  // 4: Categoria (select)
  // 5: Comprovante (input file)
  // .descricao: Observações (textarea)

  nome        = document.getElementById("nome")        || groups[0]?.querySelector("input");
  email       = document.getElementById("email")       || groups[1]?.querySelector("input[type='email'], input");
  telefone    = document.getElementById("telefone")    || groups[2]?.querySelector("input");
  cpf         = document.getElementById("cpf")         || groups[3]?.querySelector("input");
  categoria   = document.getElementById("categoria")   || groups[4]?.querySelector("select");
  comprovante = document.getElementById("comprovante") || groups[5]?.querySelector("input[type='file']");
  observacoes = document.getElementById("observacoes") || form.querySelector(".descricao textarea");

  console.log("Form encontrado?", !!form);
} else {
  console.warn("⚠️ Formulário não encontrado.");
}

// ===== Helpers de Storage =====
function getAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
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
  return true;
}

// ===== Resumo do arquivo (apenas metadados) =====
function resumirArquivo(file) {
  if (!file) return null;
  return { name: file.name, type: file.type, size: file.size };
}

// ===== Submit =====
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validar()) return;

    const file = (comprovante && comprovante.files && comprovante.files[0]) ? comprovante.files[0] : null;

    const participante = {
      id: "P-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6).toUpperCase(),
      nome: nome?.value?.trim() || "",
      email: email?.value?.trim() || "",
      telefone: telefone?.value?.trim() || "",
      cpf: cpf?.value?.trim() || "",
      categoria: (categoria && categoria.value) ? categoria.value : "",
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
}

// ===== Máscaras (opcional) =====
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
