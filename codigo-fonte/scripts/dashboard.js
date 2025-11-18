document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("loggedIn"));
  if (!userData) return;

  const data = getData();

  // Filter events to current user
  const userEvents = data.events.filter(e => e.userId === userData.id);


  // ---- METRICS ----
  const totalEvents = userEvents.length;

  // Count all guests
  const userGuests = data.guests.filter(g =>
    userEvents.some(e => e.id === g.eventId)
  );
  const totalGuests = userGuests.length;

  // Upcoming events: future dates only
  const today = new Date();
  const upcomingEvents = userEvents.filter(e => new Date(e.date) > today).length;

  // Attendance %
  let avgAttendance = 0;
  if (userEvents.length > 0) {
    const totalAttendance = userEvents.map(event => {
      const guests = userGuests.filter(g => g.eventId === event.id);
      if (guests.length === 0) return 0;
      const attended = guests.filter(g => g.attended).length;
      return attended / guests.length;
    });
    avgAttendance = (totalAttendance.reduce((a, b) => a + b, 0) / totalAttendance.length) * 100;
  }


  // ---- RENDER METRICS ----
  document.getElementById("total-events").textContent = totalEvents;
  document.getElementById("total-guests").textContent = totalGuests.toLocaleString("pt-BR");
  document.getElementById("upcoming-events").textContent = upcomingEvents;
  document.getElementById("avg-attendance").textContent = `${Math.round(avgAttendance)}%`;

  // ---- RECENT EVENTS ----
  const recentContainer = document.getElementById("recent-events");
  if (recentContainer) {
    const sorted = [...userEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = sorted.slice(0, 2);

    if (recent.length === 0) {
      recentContainer.innerHTML = `<p class="muted">Nenhum evento encontrado.</p>`;
    } else {
      recentContainer.innerHTML = recent.map(event => {
        const guestCount = userGuests.filter(g => g.eventId === event.id).length;
        const formattedDate = new Date(event.date).toLocaleDateString("pt-BR");
        return `
          <div class="recent-item">
            <div class="recent-left">
              <div class="recent-title">${event.title}</div>
              <div class="recent-date">${formattedDate}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; color:var(--velvet); font-size:20px;">${guestCount}</div>
              <div style="color:#9b9b9f; font-size:13px;">convidados</div>
            </div>
          </div>
        `;
      }).join("");
    }
  }
});
