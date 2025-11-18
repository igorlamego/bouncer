// Get data
function getData() {
  return JSON.parse(localStorage.getItem("data")) || { users: [], events: [], guests: [] };
}

// Save data
function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
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
      location: "Major Lock",
      description: "Festa de aniversário com os amigos."
    };

    const event2 = {
      id: makeId(),
      userId: adminUser.id,
      title: "Churrasco de Natal",
      date: "2025-12-24",
      location: "Porcao",
      description: "Churras HoHoHo"
    };

    const guests = [
      { id: makeId(), eventId: event1.id, name: "Igor Lamego", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Marcela Almeida", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Eduardo Ramos", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Gabriel Estebanez", promoter: "Clovis", attended: true },
      { id: makeId(), eventId: event1.id, name: "Akon", category: "VIP", promoter: "Igor", attended: false },
      { id: makeId(), eventId: event2.id, name: "Saige Fuentes", attended: true },
      { id: makeId(), eventId: event2.id, name: "Jasper", attended: true },
      { id: makeId(), eventId: event2.id, name: "Delilah", attended: false },
      { id: makeId(), eventId: event2.id, name: "Kylan Gentry", attended: true },
      { id: makeId(), eventId: event2.id, name: "Jayden", attended: false },
      { id: makeId(), eventId: event2.id, name: "Noah", attended: true },
      { id: makeId(), eventId: event2.id, name: "Knox", attended: true },
      { id: makeId(), eventId: event2.id, name: "Olivia", attended: true },
      { id: makeId(), eventId: event2.id, name: "Popeye", attended: false },
      { id: makeId(), eventId: event2.id, name: "Amelia Jones", attended: false },
      { id: makeId(), eventId: event2.id, name: "Peter Griffin", attended: true },
      { id: makeId(), eventId: event2.id, name: "Bibil", attended: true },
    ];

    data.users = data.users || [];
    data.events = data.events || [];
    data.guests = data.guests || [];

    data.users.push(adminUser);
    data.events.push(event1);
    data.events.push(event2);
    data.guests.push(...guests);

    console.log("✅ Admin and sample data loaded");
  } else {
    console.log("ℹ️ Admin data already exists");
  }

  saveData(data);
})();



// ------------ Data API ------------

// Get all
function getUsers() {
  return getData().users;
}

function getEvents() {
  return getData().events;
}

function getGuests() {
  return getData().guests;
}

// Save single
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
