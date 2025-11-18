document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) {
        alert("Evento não encontrado.");
        return;
    }

    // Get the event using data.js function
    const eventos = getEvents();
    const evento = eventos.find(e => e.id === eventId);

    if (!evento) {
        alert("Evento inexistente.");
        return;
    }

    // Fill elements with properties
    document.getElementById("event-title").textContent = evento.title;
    document.getElementById("event-subtitle").textContent = "Informações detalhadas do evento";

    document.getElementById("event-date").textContent = evento.date;
    document.getElementById("event-time").textContent = evento.horario;
    document.getElementById("event-location").textContent = evento.location;
    document.getElementById("event-description").textContent = evento.description;

    // Gets flyer
    if (evento.flyer) {
        document.getElementById("event-banner").src = evento.flyer;
    }

});
