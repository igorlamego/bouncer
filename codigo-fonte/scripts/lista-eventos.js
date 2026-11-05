document.addEventListener("DOMContentLoaded", () => {
  // Load events
  renderEvents();

  // Modal event listeners
  document.querySelector(".create-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("add-event-modal").classList.add("show");
  });

  document.getElementById("close-event-modal").addEventListener("click", closeAddEventModal);
  document.getElementById("cancel-add-event").addEventListener("click", closeAddEventModal);
  document.getElementById("add-event-form").addEventListener("submit", handleAddEvent);
});

function renderEvents() {
  const container = document.querySelector(".event-list");
  const eventos = getEvents();

  container.innerHTML = "";

  if (eventos.length === 0) {
    container.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
    return;
  }

  // Most recent first
  const time = (e) => (parseEventDate(e.date) || new Date(0)).getTime();
  [...eventos].sort((a, b) => time(b) - time(a)).forEach((evento) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h3>${escapeHtml(evento.title)}</h3>
      <p><strong>Data:</strong> ${escapeHtml(formatEventDate(evento.date))}${evento.horario ? " às " + escapeHtml(evento.horario) : ""}</p>
      <p><strong>Local:</strong> ${escapeHtml(evento.location)}</p>
      <p><strong>Descrição:</strong> ${escapeHtml(evento.description || "-")}</p>

      <a class="pill-btn" href="evento.html?id=${encodeURIComponent(evento.id)}">Ver detalhes</a>

      <button class="delete-btn" data-id="${escapeHtml(evento.id)}">
          Excluir
      </button>
    `;

    container.appendChild(card);
  });

  // Re-attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const eventId = e.currentTarget.getAttribute("data-id");

      if (confirm("Tem certeza que deseja excluir este evento? Os participantes dele também serão removidos.")) {
        deleteEvent(eventId);
      }
    });
  });
}

function closeAddEventModal() {
  document.getElementById("add-event-modal").classList.remove("show");
  document.getElementById("add-event-form").reset();
}

// Read the flyer image, shrink it and return it as a data URL,
// so it can be stored in localStorage and shown on the event page.
function readFlyer(file, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleAddEvent(e) {
  e.preventDefault();

  const title = document.getElementById("event-title").value.trim();
  const location = document.getElementById("event-location").value.trim();
  const date = document.getElementById("event-date").value; // aaaa-mm-dd
  const horario = document.getElementById("event-time").value; // hh:mm
  const numero = document.getElementById("event-capacity").value.trim();
  const description = document.getElementById("event-description").value.trim();
  const flyerInput = document.getElementById("event-flyer");

  // Validation
  if (!title || !location || !date || !horario) {
    alert("Por favor, preencha todos os campos obrigatórios (*)!");
    return;
  }

  // Get logged in user
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (!loggedIn) {
    alert("Erro: Usuário não está logado!");
    return;
  }

  // Handle flyer file
  let flyer = "";
  if (flyerInput && flyerInput.files.length > 0) {
    try {
      flyer = await readFlyer(flyerInput.files[0]);
    } catch {
      alert("Não foi possível ler o flyer. O evento será salvo sem imagem.");
    }
  }

  // Create new event
  const newEvent = {
    id: makeId(),
    userId: loggedIn.id,
    title,
    location,
    date,
    horario,
    numero,
    description,
    flyer,
  };

  // Save using existing data system
  try {
    saveEvent(newEvent);
  } catch {
    // localStorage is full (usually because of large images)
    newEvent.flyer = "";
    try {
      saveEvent(newEvent);
      alert("Sem espaço para salvar o flyer. O evento foi salvo sem imagem.");
    } catch {
      alert("Não foi possível salvar o evento: armazenamento do navegador cheio.");
      return;
    }
  }

  // Close modal and refresh events list
  closeAddEventModal();
  renderEvents();

  alert("Evento criado com sucesso!");
}

function deleteEvent(eventId) {
  const data = getData();

  // Remove the event
  data.events = data.events.filter((event) => event.id !== eventId);

  // Remove all guests associated with the event
  data.guests = data.guests.filter((guest) => guest.eventId !== eventId);

  saveData(data);
  renderEvents();
}
