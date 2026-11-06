// Id of the event being edited (null when creating a new one)
let editingEventId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Load events
  renderEvents();

  // Modal event listeners
  document.querySelector(".create-btn").addEventListener("click", (e) => {
    e.preventDefault();
    openEventModal();
  });

  // Open the editor directly (lista-eventos.html?editar=ID, used by the event page)
  const editId = new URLSearchParams(window.location.search).get("editar");
  const toEdit = editId && getEvents().find((ev) => ev.id === editId);
  if (toEdit) openEventModal(toEdit);

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

      <div class="card-actions">
        <a class="pill-btn" href="evento.html?id=${encodeURIComponent(evento.id)}">Ver detalhes</a>
        <button class="edit-btn" type="button" data-id="${escapeHtml(evento.id)}">Editar</button>
        <button class="delete-btn" type="button" data-id="${escapeHtml(evento.id)}">Excluir</button>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ev = getEvents().find((x) => x.id === e.currentTarget.getAttribute("data-id"));
      if (ev) openEventModal(ev);
    });
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

function openEventModal(evento = null) {
  editingEventId = evento ? evento.id : null;
  document.getElementById("event-modal-title").textContent = evento ? "Editar Evento" : "Criar Novo Evento";
  document.querySelector("#add-event-form .submit-btn").textContent = evento ? "Salvar Alterações" : "Salvar Evento";

  document.getElementById("event-title").value = evento ? evento.title || "" : "";
  document.getElementById("event-location").value = evento ? evento.location || "" : "";
  document.getElementById("event-date").value = evento ? toInputDate(evento.date) : "";
  document.getElementById("event-time").value = evento ? evento.horario || "" : "";
  document.getElementById("event-capacity").value = evento ? evento.numero || "" : "";
  document.getElementById("event-description").value = evento ? evento.description || "" : "";
  document.getElementById("event-flyer").value = "";
  document.getElementById("event-flyer-hint").hidden = !(evento && evento.flyer && evento.flyer.startsWith("data:image"));

  document.getElementById("add-event-modal").classList.add("show");
  document.getElementById("event-title").focus();
}

// Converts any stored date to the aaaa-mm-dd format used by <input type="date">
function toInputDate(value) {
  const d = parseEventDate(value);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function closeAddEventModal() {
  document.getElementById("add-event-modal").classList.remove("show");
  document.getElementById("add-event-form").reset();
  editingEventId = null;
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

  // Handle flyer file (when editing, keeps the current flyer if no new file is chosen)
  const current = editingEventId ? getEvents().find((ev) => ev.id === editingEventId) : null;
  let flyer = current ? current.flyer || "" : "";
  if (flyerInput && flyerInput.files.length > 0) {
    try {
      flyer = await readFlyer(flyerInput.files[0]);
    } catch {
      alert("Não foi possível ler o flyer. O evento será salvo sem imagem.");
    }
  }

  // Create new event (or keep id/owner when editing)
  const newEvent = {
    id: editingEventId || makeId(),
    userId: current ? current.userId : loggedIn.id,
    title,
    location,
    date,
    horario,
    numero,
    description,
    flyer,
  };

  // Save using existing data system
  const persist = (ev) => {
    if (!editingEventId) return saveEvent(ev);
    const data = getData();
    const idx = data.events.findIndex((x) => x.id === ev.id);
    if (idx !== -1) data.events[idx] = ev;
    saveData(data);
  };

  try {
    persist(newEvent);
  } catch {
    // localStorage is full (usually because of large images)
    newEvent.flyer = "";
    try {
      persist(newEvent);
      alert("Sem espaço para salvar o flyer. O evento foi salvo sem imagem.");
    } catch {
      alert("Não foi possível salvar o evento: armazenamento do navegador cheio.");
      return;
    }
  }

  // Close modal and refresh events list
  const wasEditing = !!editingEventId;
  closeAddEventModal();
  renderEvents();

  showToast(wasEditing ? "Evento atualizado!" : "Evento criado com sucesso!");
}

function deleteEvent(eventId) {
  const data = getData();

  // Remove the event
  data.events = data.events.filter((event) => event.id !== eventId);

  // Remove all guests associated with the event
  data.guests = data.guests.filter((guest) => guest.eventId !== eventId);

  saveData(data);
  renderEvents();
  showToast("Evento excluído.");
}
