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

  // Upcoming events: today or later
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = userEvents.filter(e => {
    const d = parseEventDate(e.date);
    return d && d >= today;
  }).length;

  // Attendance %: average over events that already happened and have guests
  // (future events would always count as 0% and pull the average down)
  let avgAttendance = 0;
  const pastEvents = userEvents.filter(e => {
    const d = parseEventDate(e.date);
    return d && d < today && userGuests.some(g => g.eventId === e.id);
  });
  if (pastEvents.length > 0) {
    const rates = pastEvents.map(event => {
      const guests = userGuests.filter(g => g.eventId === event.id);
      return guests.filter(g => g.attended).length / guests.length;
    });
    avgAttendance = (rates.reduce((a, b) => a + b, 0) / rates.length) * 100;
  }


  // ---- RENDER METRICS ----
  document.getElementById("total-events").textContent = totalEvents;
  document.getElementById("total-guests").textContent = totalGuests.toLocaleString("pt-BR");
  document.getElementById("upcoming-events").textContent = upcomingEvents;
  // "—" when there is no finished event with guests yet
  document.getElementById("avg-attendance").textContent =
    pastEvents.length > 0 ? `${Math.round(avgAttendance)}%` : "—";

  // ---- RECENT EVENTS ----
  const recentContainer = document.getElementById("recent-events");
  if (recentContainer) {
    const time = e => (parseEventDate(e.date) || new Date(0)).getTime();
    const sorted = [...userEvents].sort((a, b) => time(b) - time(a));
    const recent = sorted.slice(0, 2);

    if (recent.length === 0) {
      recentContainer.innerHTML = `<p class="muted">Nenhum evento encontrado.</p>`;
    } else {
      recentContainer.innerHTML = recent.map(event => {
        const guestCount = userGuests.filter(g => g.eventId === event.id).length;
        const formattedDate = formatEventDate(event.date);
        return `
          <div class="recent-item">
            <div class="recent-left">
              <a class="recent-title" href="evento.html?id=${encodeURIComponent(event.id)}">${escapeHtml(event.title)}</a>
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
