// novo-evento.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script carregado e DOM pronto!");

  // Seleciona o formulário
  const form = document.querySelector("form");

  if (!form) {
    console.error("❌ Formulário não encontrado!");
    return;
  }

  // Adiciona o listener para o envio do formulário
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o recarregamento da página

    // Coleta os dados do formulário
    const nome = document.querySelector("input[placeholder='Digite o nome do evento']").value.trim();
    const local = document.querySelector("input[placeholder='Digite o local do evento']").value.trim();
    const data = document.querySelector("input[placeholder='dd/mm/aaaa']").value.trim();
    const horario = document.querySelector("input[placeholder='hh : mm']").value.trim();
    const numero = document.querySelector("input[type='number']").value.trim();
    const descricao = document.querySelector("textarea").value.trim();
    const flyerInput = document.querySelector("input[type='file']");

    // Validação simples
    if (!nome || !local || !data || !horario) {
      alert("Por favor, preencha todos os campos obrigatórios (*)!");
      return;
    }

    // Pega o nome do arquivo do flyer (se houver)
    const flyer = flyerInput && flyerInput.files.length > 0 ? flyerInput.files[0].name : "";

    // Cria o objeto do evento
    const evento = {
      nome,
      local,
      data,
      horario,
      numero,
      descricao,
      flyer,
    };

    // Recupera os eventos já salvos ou cria um array vazio
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    // Adiciona o novo evento
    eventos.push(evento);

    // Salva no localStorage
    localStorage.setItem("eventos", JSON.stringify(eventos));

    // Feedback no console e na tela
    console.log("✅ Evento salvo:", evento);
    alert("🎉 Evento salvo com sucesso!");

    // Limpa o formulário
    form.reset();
  });
});

