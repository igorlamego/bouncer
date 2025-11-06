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

// Preload or ensure admin always exists
(function preloadData() {
  let data = getData();

  // Define admin info
  const adminEmail = "clovis@admin.com";
  const adminPassword = "clovis123";

  // Check if admin exists
  const adminExists = data.users.some(u => u.emailUser === adminEmail);

  // Create admin
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
      description: "Festa de aniversário com os amigos.",
    };

    const guests = [
      {
        id: makeId(),
        eventId: event1.id,
        name: "Igor Lamego",
        attended: true,
      },
      {
        id: makeId(),
        eventId: event1.id,
        name: "Marcela Almeida",
        attended: true,
      },
      {
        id: makeId(),
        eventId: event1.id,
        name: "Eduardo Ramos",
        attended: true
      },
      {
        id: makeId(),
        eventId: event1.id,
        name: "Gabriel Estebanez",
        attended: true
      },
      {
        id: makeId(),
        eventId: event1.id,
        name: "Akon",
        attended: false
      }
    ];

    data.users.push(adminUser);
    data.events = data.events || [];
    data.events.push(event1);
    data.guests = data.guests || [];
    data.guests.push(...guests);

    console.log("Admin data loaded");
  } else {
    console.log("Admin data already exists")
  }

  saveData(data);
})();
