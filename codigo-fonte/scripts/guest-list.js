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

  // Filters only change when the user clicks "Aplicar Filtros"
  let appliedFilters = { category: "", status: "" };
  const filtersToggle = document.getElementById("filters-toggle");
  const clearFiltersBtn = document.getElementById("clear-filters");

  populateEventSelect();
  setEventFromSelect();
  attachListeners();
  render();

  // ---- functions ----
  function populateEventSelect() {
    eventSelect.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "Todos os eventos";
    eventSelect.appendChild(optAll);

    allEvents.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = e.title;
      eventSelect.appendChild(opt);
    });

    // Pre-select the event when coming from the event page (guest-list.html?evento=ID)
    const fromUrl = new URLSearchParams(window.location.search).get("evento");
    if (fromUrl && allEvents.some(e => e.id === fromUrl)) {
      eventSelect.value = fromUrl;
    }
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
      currentSearch = normalizeText(searchInput.value);
      resetAndRender();
    }, 220));

    // Enter inside the search box should not submit anything
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });

    loadMoreBtn.addEventListener("click", () => {
      page++;
      renderRows();
    });

    filtersToggle.addEventListener("click", () => {
      // Show the filters that are really applied
      filterCategory.value = appliedFilters.category;
      filterStatus.value = appliedFilters.status;
      filterPopout.classList.add("open");
    });

    // Closing without applying discards the changes
    closeFiltersBtn.addEventListener("click", () => {
      filterCategory.value = appliedFilters.category;
      filterStatus.value = appliedFilters.status;
      filterPopout.classList.remove("open");
    });

    applyFiltersBtn.addEventListener("click", () => {
      applyAdvancedFilters();
      filterPopout.classList.remove("open");
    });

    clearFiltersBtn.addEventListener("click", () => {
      filterCategory.value = "";
      filterStatus.value = "";
      applyAdvancedFilters();
      filterPopout.classList.remove("open");
    });

    // Replace the external link with modal opener
    document.querySelector('.add-btn').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('add-guest-modal').classList.add('show');
    });

    // Modal close handlers
    document.getElementById('close-modal').addEventListener('click', closeAddGuestModal);
    document.getElementById('cancel-add-guest').addEventListener('click', closeAddGuestModal);

    // Form submission
    document.getElementById('add-guest-form').addEventListener('submit', handleAddGuest);

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
  
      // Filter by SEARCH (name, contact or promoter; ignores case and accents)
      if (currentSearch) {
        const haystack = normalizeText([g.name, g.contact, g.promoter].join(" "));
        if (!haystack.includes(currentSearch)) return false;
      }
  
      // Filter by CATEGORY
      if (appliedFilters.category && g.category !== appliedFilters.category) {
        return false;
      }
  
      // Filter by STATUS
      if (appliedFilters.status === "present" && !g.attended) {
        return false;
      }
  
      if (appliedFilters.status === "absent" && g.attended) {
        return false;
      }
  
      return true;
    });
  }

  function applyAdvancedFilters() {
    appliedFilters = {
      category: filterCategory.value,
      status: filterStatus.value,
    };

    // Show how many filters are active on the button
    const active = Object.values(appliedFilters).filter(Boolean).length;
    filtersToggle.textContent = active ? `Filtros (${active})` : "Filtros";
    filtersToggle.classList.toggle("active", active > 0);

    resetAndRender();
  }

  // Lowercase, trim and remove accents: "João " -> "joao"
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
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

  // Renders the rows of the current page.
  // With fromStart = true it redraws every page already loaded (used after a status change).
  function renderRows(fromStart = false) {
    const start = fromStart ? 0 : page * PAGE_SIZE;
    const end = (page + 1) * PAGE_SIZE;
    const rows = filteredGuests.slice(start, end);

    if (fromStart || page === 0) {
      guestsTbody.innerHTML = "";
    }

    if (filteredGuests.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.className = "empty-row";
      td.textContent = "Nenhum participante encontrado.";
      tr.appendChild(td);
      guestsTbody.appendChild(tr);
    }

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

    // re-render keeping the pages already loaded ("ver mais")
    refreshData();
    renderRows(true);
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

  function closeAddGuestModal() {
  document.getElementById('add-guest-modal').classList.remove('show');
  document.getElementById('add-guest-form').reset();
  }

  function handleAddGuest(e) {
    e.preventDefault();
    
    const name = document.getElementById('guest-name').value.trim();
    const contact = document.getElementById('guest-contact').value.trim();
    const category = document.getElementById('guest-category').value;
    const promoter = document.getElementById('guest-promoter').value.trim();
    const notes = document.getElementById('guest-notes').value.trim();
    
    if (!name) {
      alert('Por favor, preencha o nome do participante.');
      return;
    }
  
    // Get current event - if "none" or no event selected, show error
    if (!currentEventId || currentEventId === "all") {
      alert('Por favor, selecione um evento antes de adicionar participantes.');
      return;
    }
  
    const newGuest = {
      id: makeId(),
      eventId: currentEventId,
      name: name,
      contact: contact,
      category: category,
      promoter: promoter,
      notes: notes,
      attended: false
    };
  
    // Save using your existing data system
    saveGuest(newGuest);
  
    // Close modal and refresh
    closeAddGuestModal();
    resetAndRender();
    
    alert('Participante adicionado com sucesso!');
  }

});
