document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    // Get the event using data.js function (only events of the logged user)
    const evento = eventId ? getEvents().find(e => e.id === eventId) : null;

    if (!evento) {
        alert("Evento não encontrado.");
        window.location.href = "lista-eventos.html";
        return;
    }

    // Fill elements with properties
    document.title = `${evento.title} - Bouncer`;
    document.getElementById("event-title").textContent = evento.title;
    document.getElementById("event-subtitle").textContent = "Informações detalhadas do evento";

    document.getElementById("event-date").textContent = formatEventDate(evento.date);
    document.getElementById("event-time").textContent = evento.horario || "Não informado";
    document.getElementById("event-location").textContent = evento.location || "-";
    document.getElementById("event-description").textContent = evento.description || "Sem descrição.";

    // Guest list summary
    const guests = getGuests().filter(g => g.eventId === evento.id);
    document.getElementById("event-capacity").textContent =
        evento.numero ? `${evento.numero} pessoas` : "Não informada";
    document.getElementById("event-guests").textContent = guests.length;
    document.getElementById("event-attended").textContent = guests.filter(g => g.attended).length;
    document.getElementById("event-guests-link").href =
        `guest-list.html?evento=${encodeURIComponent(evento.id)}`;

    // Show flyer only when it is a stored image (older events saved just the file name)
    if (evento.flyer && evento.flyer.startsWith("data:image")) {
        document.getElementById("event-banner").src = evento.flyer;
        document.getElementById("event-image").hidden = false;
    }
});
