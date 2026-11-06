// Get data
function getData() {
  return JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };
}

// Save data
function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

// Escape text before inserting it with innerHTML (prevents broken layout / XSS)
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Parse an event date as a LOCAL date.
// Accepts "aaaa-mm-dd" (input type="date") and "dd/mm/aaaa" (older records).
// new Date("2025-12-24") would be read as UTC and show the previous day in Brazil.
function parseEventDate(value) {
  if (!value) return null;
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

// Format an event date as dd/mm/aaaa
function formatEventDate(value) {
  const d = parseEventDate(value);
  return d ? d.toLocaleDateString("pt-BR") : (value || "-");
}

// Generate unique IDs
function makeId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Preload clovis + data
(function preloadData() {
  let data = getData();

  // Define admin info
  const adminEmail = "clovis@admin.com";
  const adminPassword = "clovis123";

  // Check if admin exists
  const adminExists = data.users.some(u => u.emailUser === adminEmail);

  // Create admin and initial events
  if (!adminExists) {
    const adminUser = {
      id: makeId(),
      nomeUser: "Clovis",
      emailUser: adminEmail,
      senhaUser: adminPassword,
      role: "admin"
    };
  
    const event1 = {
      id: makeId(),
      userId: adminUser.id,
      title: "Bday Clovis",
      date: "2025-07-20",
      horario: "22:00",
      numero: "150",
      location: "Major Lock",
      description: "Festa de aniversário com os amigos."
    };

    // Demo event always one month ahead, so the dashboard shows an upcoming event
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    const pad = n => String(n).padStart(2, "0");
    const upcomingDate = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;

    const event3 = {
      id: makeId(),
      userId: adminUser.id,
      title: "Festa de Formatura ADS",
      date: upcomingDate,
      horario: "23:00",
      numero: "300",
      location: "Mineirão - Esplanada",
      description: "Comemoração da turma de Análise e Desenvolvimento de Sistemas."
    };

    const event2 = {
      id: makeId(),
      userId: adminUser.id,
      title: "Churrasco de Natal",
      date: "2025-12-24",
      horario: "13:00",
      numero: "40",
      location: "Porcão",
      description: "Churras HoHoHo"
    };

    const guests = [
      { id: makeId(), eventId: event1.id, name: "Igor Lamego", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Marcela Almeida", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Eduardo Ramos", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Gabriel Estabanez", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Akon", category: "VIP", promoter: "Igor", attended: false },
      { id: makeId(), eventId: event2.id, name: "Saige Fuentes", category: "VIP", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Jasper", category: "Lista", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Delilah", category: "Lista", promoter: "Clovis", attended: false },
      { id: makeId(), eventId: event2.id, name: "Kylan Gentry", category: "Cortesia", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Jayden", category: "Lista", promoter: "Clovis", attended: false },
      { id: makeId(), eventId: event2.id, name: "Noah", category: "VIP", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Knox", category: "Lista", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Olivia", category: "Lista", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Popeye", category: "Cortesia", promoter: "Clovis", attended: false },
      { id: makeId(), eventId: event2.id, name: "Amelia Jones", category: "VIP", promoter: "Clovis", attended: false },
      { id: makeId(), eventId: event2.id, name: "Peter Griffin", category: "Lista", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event2.id, name: "Bibil", category: "Lista", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event3.id, name: "Ana Souza", contact: "(31) 99999-0001", category: "VIP", promoter: "Marcela", attended: false },
      { id: makeId(), eventId: event3.id, name: "Bruno Lima", contact: "bruno@email.com", category: "Lista", promoter: "Eduardo", attended: false },
      { id: makeId(), eventId: event3.id, name: "Carla Mendes", contact: "(31) 98888-0002", category: "Cortesia", promoter: "Gabriel", attended: false, notes: "Acompanhante +1" },
      { id: makeId(), eventId: event3.id, name: "Diego Rocha", category: "Lista", promoter: "Igor", attended: false },
      { id: makeId(), eventId: event3.id, name: "Elisa Martins", contact: "elisa@email.com", category: "VIP", promoter: "Igor", attended: false, notes: "Aniversariante" },
    ];

    data.users = data.users || [];
    data.events = data.events || [];
    data.guests = data.guests || [];

    data.users.push(adminUser);
    data.events.push(event1);
    data.events.push(event2);
    data.events.push(event3);
    data.guests.push(...guests);

    console.log("✅ Admin and sample data loaded");
  } else {
    console.log("ℹ️ Admin data already exists");
  }

  saveData(data);
})();



// ------------ Data API ------------

// Get all
function getEvents() {
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  const allEvents = getData().events;
  
  if (!loggedIn) return allEvents;

  return allEvents.filter(event => event.userId === loggedIn.id);
}

function getGuests() {
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  const allGuests = getData().guests;
  const userEvents = getEvents();

  if (!loggedIn) return allGuests;

  const userEventIds = userEvents.map(event => event.id);
  return allGuests.filter(guest => userEventIds.includes(guest.eventId));
}


// Save single
function getUsers() {
  return getData().users;
}

function saveUser(user) {
  const data = getData();
  data.users = data.users || [];
  data.users.push(user);
  saveData(data);
}

function saveEvent(event) {
  const data = getData();
  data.events = data.events || [];
  data.events.push(event);
  saveData(data);
}

function saveGuest(guest) {
  const data = getData();
  data.guests = data.guests || [];
  data.guests.push(guest);
  saveData(data);
}

// Make it global
window.getData = getData;
window.saveData = saveData;
window.getUsers = getUsers;
window.getEvents = getEvents;
window.getGuests = getGuests;
window.saveUser = saveUser;
window.saveEvent = saveEvent;
window.saveGuest = saveGuest;
window.escapeHtml = escapeHtml;
window.parseEventDate = parseEventDate;
window.formatEventDate = formatEventDate;



// ------------ Header Profile ------------

document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("loggedIn"));

  // Stop if not logged in
  if (!userData) return;

  // Header elements
  const avatar = document.querySelector(".avatar");
  const profileName = document.querySelector(".profile-name");

  if (!avatar || !profileName) return;

  // Set profile info
  avatar.textContent = userData.nomeUser.charAt(0).toUpperCase();
  profileName.textContent = userData.nomeUser.trim().split(" ")[0];
});


// ------------ UI helpers shared by every page ------------

// Small notification at the bottom of the screen (instead of alert)
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    Object.assign(toast.style, {
      position: "fixed", left: "50%", bottom: "24px", transform: "translateX(-50%)",
      background: "#2d2a55", color: "#fff", padding: "12px 20px", borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "'Inter', sans-serif",
      fontSize: "15px", zIndex: "9999", opacity: "0", transition: "opacity 0.2s ease",
      pointerEvents: "none", maxWidth: "90vw", textAlign: "center",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => (toast.style.opacity = "0"), 2500);
}
window.showToast = showToast;

// Modals close with Esc or by clicking outside the box (uses the modal's Cancel button)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = document.querySelector(".modal.show");
  if (open) open.querySelector(".cancel-btn")?.click();
  document.querySelector(".filter-popout.open .close-btn")?.click();
});

document.addEventListener("click", (e) => {
  if (e.target.classList && e.target.classList.contains("modal") && e.target.classList.contains("show")) {
    e.target.querySelector(".cancel-btn")?.click();
  }
});
