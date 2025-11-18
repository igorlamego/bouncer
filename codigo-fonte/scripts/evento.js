document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Evento não encontrado.");
        return;
    }

    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const evento = eventos[id];

    if (!evento) {
        alert("Evento inexistente.");
        return;
    }

    // Preenche os elementos
    document.getElementById("event-title").textContent = evento.titulo;
    document.getElementById("event-subtitle").textContent = "Informações detalhadas do evento";

    document.getElementById("event-date").textContent = evento.data;
    document.getElementById("event-time").textContent = evento.horario;
    document.getElementById("event-location").textContent = evento.local;
    document.getElementById("event-description").textContent = evento.descricao;

    // Se tiver imagem cadastrada
    if (evento.imagem) {
        document.getElementById("event-banner").src = evento.imagem;
    }
});
