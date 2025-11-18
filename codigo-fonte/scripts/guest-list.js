document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("event-select")) return;

  const eventSelect = document.getElementById("event-select");
  const participantsTotal = document.getElementById("participants-total");
  const guestsTbody = document.getElementById("guests-tbody");
  const searchInput = document.getElementById("guest-search");
  const loadMoreBtn = document.getElementById("load-more-btn");

  const filterPopout = document.getElementById("filter-popout");
  const closeFiltersBtn = document.getElementById("close-filters");
  const applyFiltersBtn = document.getElementById("apply-filters");

  const filterCategory = document.getElementById("filter-category");
  const filterStatus = document.getElementById("filter-status");

  const PAGE_SIZE = 10;
  let currentEventId = "all";
  let allGuests = getGuests();
  let allEvents = getEvents();
  let filteredGuests = [];
  let page = 0;
  let currentSearch = "";

  populateEventSelect();
  setEventFromSelect();
  attachListeners();
  render();

  // ---- functions ----
  function populateEventSelect() {
    eventSelect.innerHTML = "";
    const optNone = document.createElement("option");
    optNone.value = "none";
    optNone.textContent = "Escolha um evento";
    eventSelect.appendChild(optNone);

    allEvents.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = e.title;
      eventSelect.appendChild(opt);
    });
  }

  function setEventFromSelect() {
    currentEventId = eventSelect.value || "all";
  }

  function attachListeners() {
    eventSelect.addEventListener("change", () => {
      setEventFromSelect();
      resetAndRender();
    });

    searchInput.addEventListener("input", debounce(() => {
      currentSearch = searchInput.value.trim().toLowerCase();
      resetAndRender();
    }, 220));

    loadMoreBtn.addEventListener("click", () => {
      page++;
      renderRows();
    });

    document.getElementById("filters-toggle").addEventListener("click", () => {
      filterPopout.classList.add("open");
    });

    closeFiltersBtn.addEventListener("click", () => {
      filterPopout.classList.remove("open");
    });

    applyFiltersBtn.addEventListener("click", () => {
      applyAdvancedFilters();
      filterPopout.classList.remove("open");
    })
  }

  function resetAndRender() {
    page = 0;
    refreshData();
    render();
  }

function refreshData() {
  allGuests = getGuests();
  allEvents = getEvents();

  filteredGuests = allGuests.filter(g => {

    // Filter by EVENT
    if (currentEventId !== "all" && g.eventId !== currentEventId) return false;

    // Filter by SEARCH
    const name = (g.name || "").toLowerCase();
    const contact = (g.contact || "").toLowerCase();

    if (currentSearch && !name.includes(currentSearch) && !contact.includes(currentSearch)) {
      return false;
    }

    // Filter by CATEGORY
    if (filterCategory.value && g.category !== filterCategory.value) {
      return false;
    }

    // Filter by STATUS
    if (filterStatus.value === "present" && !g.attended) {
      return false;
    }

    if (filterStatus.value === "absent" && g.attended) {
      return false;
    }

    return true;
  });
}

  function applyAdvancedFilters() {
  resetAndRender();
}


  // update totals
  function render() {
    refreshData();
    const confirmedCount = filteredGuests.filter(g => g.attended).length;
    participantsTotal.textContent = confirmedCount.toLocaleString("pt-BR");


    // clear table and render rows page 0
    guestsTbody.innerHTML = "";
    renderRows();
  }

  function renderRows() {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const rows = filteredGuests.slice(start, end);

    rows.forEach(g => {
      const tr = document.createElement("tr");

      // Name
      const tdName = document.createElement("td");
      tdName.textContent = g.name || "-";
      tr.appendChild(tdName);

      // Contact
      const tdContact = document.createElement("td");
      tdContact.textContent = g.contact || "-";
      tr.appendChild(tdContact);

      // Category
      const tdCat = document.createElement("td");
      tdCat.textContent = g.category || "";
      tr.appendChild(tdCat);

      // Status (toggle attendance)
      const tdAction = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = g.attended ? "small-btn confirmed" : "small-btn not-confirmed";
      btn.textContent = g.attended ? "Confirmado" : "Pendente";
      btn.addEventListener("click", () => {
      g.attended = !g.attended;

      btn.textContent = g.attended ? "Confirmado" : "Pendente";
      btn.className = g.attended ? "small-btn confirmed" : "small-btn not-confirmed";

      toggleAttendance(g.id, g.attended);
    });

    tdAction.appendChild(btn);
    tr.appendChild(tdAction);

      // Promoter
      const tdProm = document.createElement("td");
      tdProm.textContent = g.promoter || "";
      tr.appendChild(tdProm);

      // Obs
      const tdObs = document.createElement("td");
      tdObs.textContent = g.notes || "";
      tr.appendChild(tdObs);

      guestsTbody.appendChild(tr);
    });

    // load more
    if ((page + 1) * PAGE_SIZE >= filteredGuests.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  }

  function toggleAttendance(guestId, newStatus) {
  const data = getData();
  const idx = data.guests.findIndex(g => g.id === guestId);
  if (idx === -1) return;

  // Save the updated status only once
  data.guests[idx].attended = newStatus;
  saveData(data);

    // re-render
    refreshData();
    guestsTbody.innerHTML = "";
    renderRows();
    // update total metric
    const confirmedCount = filteredGuests.filter(g => g.attended).length;
    participantsTotal.textContent = confirmedCount.toLocaleString("pt-BR");

  }

  // basic debounce helper
  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }
});
