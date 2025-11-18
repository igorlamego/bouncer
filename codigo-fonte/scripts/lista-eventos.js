document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".event-list");

  // Load events
  renderEvents();

  // Modal event listeners
  document.querySelector('.create-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('add-event-modal').classList.add('show');
  });

  document.getElementById('close-event-modal').addEventListener('click', closeAddEventModal);
  document.getElementById('cancel-add-event').addEventListener('click', closeAddEventModal);
  document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);
});

function renderEvents() {
  const container = document.querySelector(".event-list");
  let eventos = getEvents();

  container.innerHTML = "";

  if (eventos.length === 0) {
    container.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
    return;
  }

  eventos.forEach((evento) => {
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

  // Re-attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const eventId = e.target.getAttribute("data-id");

      if (confirm("Tem certeza que deseja excluir este evento?")) {
        deleteEvent(eventId);
      }
    });
  });
}

function closeAddEventModal() {
  document.getElementById('add-event-modal').classList.remove('show');
  document.getElementById('add-event-form').reset();
}

function handleAddEvent(e) {
  e.preventDefault();
  
  const title = document.getElementById('event-title').value.trim();
  const location = document.getElementById('event-location').value.trim();
  const date = document.getElementById('event-date').value.trim();
  const horario = document.getElementById('event-time').value.trim();
  const numero = document.getElementById('event-capacity').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const flyerInput = document.getElementById('event-flyer');

  // Validation
  if (!title || !location || !date || !horario) {
    alert('Por favor, preencha todos os campos obrigatórios (*)!');
    return;
  }

  // Get logged in user
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (!loggedIn) {
    alert("Erro: Usuário não está logado!");
    return;
  }

  // Handle flyer file
  const flyer = flyerInput && flyerInput.files.length > 0 ? flyerInput.files[0].name : "";

  // Create new event
  const newEvent = {
    id: makeId(),
    userId: loggedIn.id,
    title: title,
    location: location,
    date: date,
    horario: horario,
    numero: numero,
    description: description,
    flyer: flyer
  };

  // Save using existing data system
  saveEvent(newEvent);

  // Close modal and refresh events list
  closeAddEventModal();
  renderEvents();
  
  alert('Evento criado com sucesso!');
}

function deleteEvent(eventId) {
  const data = getData();
  
  // Remove the event
  data.events = data.events.filter(event => event.id !== eventId);
  
  // Remove all guests associated with the event
  data.guests = data.guests.filter(guest => guest.eventId !== eventId);
  
  saveData(data);
  renderEvents(); // Use renderEvents instead of location.reload()
}
