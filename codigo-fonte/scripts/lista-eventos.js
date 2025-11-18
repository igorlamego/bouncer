document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".event-list");

  let eventos = getEvents();

  container.innerHTML = "";

  if (eventos.length === 0) {
    container.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
    return;
  }

  eventos.forEach((evento, index) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h3>${evento.title}</h3>
      <p><strong>Data:</strong> ${evento.date}</p>
      <p><strong>Local:</strong> ${evento.location}</p>
      <p><strong>Descrição:</strong> ${evento.description}</p>

      <a class="pill-btn" href="evento.html?id=${evento.id}">Ver detalhes</a>

      <button class="delete-btn" data-id="${evento.id}">
          Excluir
      </button>
    `;

    container.appendChild(card);
  });

  // ===== EXCLUIR EVENTO =====
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const eventId = e.target.getAttribute("data-id");

      if (confirm("Tem certeza que deseja excluir este evento?")) {
        deleteEvent(eventId);
      }
    });
  });
});

function deleteEvent(eventId) {
  const data = getData();
  
  // Remove the event
  data.events = data.events.filter(event => event.id !== eventId);
  
  // Remove all guests associated with the event
  data.guests = data.guests.filter(guest => guest.eventId !== eventId);
  
  saveData(data);
  location.reload(); // reload list
}
