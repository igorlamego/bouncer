// ===== Configuração =====
const STORAGE_KEY = "participantes";

// Campos do formulário
const form = document.getElementById("form-participante");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const cpf = document.getElementById("cpf");
const categoria = document.getElementById("categoria");
const comprovante = document.getElementById("comprovante");
const observacoes = document.getElementById("observacoes");

// ===== Funções utilitárias de Storage =====
function getAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ===== Validação simples =====
function validar() {
  if (!nome.value.trim()) {
    alert("Informe o nome do participante.");
    nome.focus();
    return false;
  }
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    alert("E-mail inválido.");
    email.focus();
    return false;
  }
  return true;
}

// Somente metadados do arquivo (LocalStorage não guarda binário)
function resumirArquivo(file) {
  if (!file) return null;
  return { name: file.name, type: file.type, size: file.size };
}

// ===== Envio do formulário =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validar()) return;

  const file = comprovante.files?.[0] || null;

  const participante = {
    id: "P-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6).toUpperCase(),
    nome: nome.value.trim(),
    email: email.value.trim(),
    telefone: telefone.value.trim(),
    cpf: cpf.value.trim(),
    categoria: categoria.value || "",
    comprovante: resumirArquivo(file), // só metadados
    observacoes: observacoes.value.trim(),
    criadoEm: new Date().toISOString()
  };

  const lista = getAll();
  lista.push(participante);
  setAll(lista);

  alert("✅ Participante cadastrado com sucesso!");
  form.reset();
});

// ===== Máscaras simples (opcional) =====
telefone.addEventListener("input", () => {
  let v = telefone.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) telefone.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) telefone.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else telefone.value = v;
});

cpf.addEventListener("input", () => {
  let v = cpf.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 9) cpf.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
  else if (v.length > 6) cpf.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  else if (v.length > 3) cpf.value = `${v.slice(0,3)}.${v.slice(3)}`;
  else cpf.value = v;
});
