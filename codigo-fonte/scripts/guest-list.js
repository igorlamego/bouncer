document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("event-select")) return;

  const eventSelect = document.getElementById("event-select");
  const participantsTotal = document.getElementById("participants-total");
  const guestsTable = document.getElementById("guests-table");
  const guestsTbody = document.getElementById("guests-tbody");
  const searchInput = document.getElementById("guest-search");
  const loadMoreBtn = document.getElementById("load-more-btn");

  const filterPopout = document.getElementById("filter-popout");
  const filtersToggle = document.getElementById("filters-toggle");
  const closeFiltersBtn = document.getElementById("close-filters");
  const applyFiltersBtn = document.getElementById("apply-filters");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const filterCategory = document.getElementById("filter-category");
  const filterStatus = document.getElementById("filter-status");

  const modal = document.getElementById("add-guest-modal");
  const modalTitle = document.getElementById("guest-modal-title");
  const guestForm = document.getElementById("add-guest-form");
  const guestEventSelect = document.getElementById("guest-event");

  const PAGE_SIZE = 10;
  let currentEventId = "all";
  let allGuests = [];
  let allEvents = [];
  let filteredGuests = [];
  let page = 0;
  let currentSearch = "";
  let editingGuestId = null;

  // Filters only change when the user clicks "Aplicar Filtros"
  let appliedFilters = { category: "", status: "" };

  allEvents = getEvents();
  populateEventSelect();
  setEventFromSelect();
  attachListeners();
  render();

  // ---------- setup ----------
  function populateEventSelect() {
    eventSelect.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "Todos os eventos";
    eventSelect.appendChild(optAll);

    allEvents.forEach((e) => eventSelect.appendChild(makeOption(e.id, e.title)));

    // Pre-select the event when coming from the event page (guest-list.html?evento=ID)
    const fromUrl = new URLSearchParams(window.location.search).get("evento");
    if (fromUrl && allEvents.some((e) => e.id === fromUrl)) {
      eventSelect.value = fromUrl;
    }
  }

  function makeOption(value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    return opt;
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

    document.querySelector(".add-btn").addEventListener("click", (e) => {
      e.preventDefault();
      openGuestModal();
    });

    document.getElementById("close-modal").addEventListener("click", closeGuestModal);
    document.getElementById("cancel-add-guest").addEventListener("click", closeGuestModal);
    guestForm.addEventListener("submit", handleSaveGuest);
  }

  // ---------- data ----------
  function resetAndRender() {
    page = 0;
    render();
  }

  function refreshData() {
    allGuests = getGuests();
    allEvents = getEvents();

    filteredGuests = allGuests.filter((g) => {
      // Filter by EVENT
      if (currentEventId !== "all" && g.eventId !== currentEventId) return false;

      // Filter by SEARCH (name, contact or promoter; ignores case and accents)
      if (currentSearch) {
        const haystack = normalizeText([g.name, g.contact, g.promoter].join(" "));
        if (!haystack.includes(currentSearch)) return false;
      }

      // Filter by CATEGORY
      if (appliedFilters.category && g.category !== appliedFilters.category) return false;

      // Filter by STATUS
      if (appliedFilters.status === "present" && !g.attended) return false;
      if (appliedFilters.status === "absent" && g.attended) return false;

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

  // ---------- render ----------
  function render() {
    refreshData();
    updateTotal();

    // "Evento" column only makes sense when showing every event
    guestsTable.classList.toggle("show-event", currentEventId === "all");

    guestsTbody.innerHTML = "";
    renderRows();
  }

  function updateTotal() {
    const confirmedCount = filteredGuests.filter((g) => g.attended).length;
    participantsTotal.textContent = confirmedCount.toLocaleString("pt-BR");
  }

  function cell(tr, label, text, className) {
    const td = document.createElement("td");
    td.dataset.label = label; // used by the mobile layout
    if (className) td.className = className;
    if (text !== undefined) td.textContent = text;
    tr.appendChild(td);
    return td;
  }

  // Renders the rows of the current page.
  // With fromStart = true it redraws every page already loaded (used after a change).
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
      td.colSpan = 8;
      td.className = "empty-row";
      if (allEvents.length === 0) {
        td.innerHTML = 'Nenhum evento cadastrado. <a href="lista-eventos.html">Crie seu primeiro evento</a>.';
      } else {
        td.textContent = "Nenhum participante encontrado.";
      }
      tr.appendChild(td);
      guestsTbody.appendChild(tr);
    }

    const eventTitle = Object.fromEntries(allEvents.map((e) => [e.id, e.title]));

    rows.forEach((g) => {
      const tr = document.createElement("tr");

      cell(tr, "Nome", g.name || "-", "col-name");
      cell(tr, "Evento", eventTitle[g.eventId] || "-", "col-event");
      cell(tr, "Contato", g.contact || "-", "col-nowrap");
      cell(tr, "Categoria", g.category || "-");

      // Status (toggle attendance)
      const tdStatus = cell(tr, "Status");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = g.attended ? "small-btn confirmed" : "small-btn not-confirmed";
      btn.textContent = g.attended ? "Confirmado" : "Pendente";
      btn.title = "Clique para alterar a presença";
      btn.addEventListener("click", () => updateGuest(g.id, { attended: !g.attended }));
      tdStatus.appendChild(btn);

      cell(tr, "Promoter", g.promoter || "-");
      cell(tr, "Observações", g.notes || "-");

      // Actions
      const tdActions = cell(tr, "Ações", undefined, "col-actions");
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "icon-btn edit-guest-btn";
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", () => openGuestModal(g));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "icon-btn delete-guest-btn";
      delBtn.textContent = "Remover";
      delBtn.addEventListener("click", () => removeGuest(g));

      tdActions.append(editBtn, delBtn);
      guestsTbody.appendChild(tr);
    });

    // load more
    loadMoreBtn.style.display = end >= filteredGuests.length ? "none" : "inline-block";
  }

  // ---------- actions ----------
  function updateGuest(guestId, changes) {
    const data = getData();
    const guest = data.guests.find((g) => g.id === guestId);
    if (!guest) return;
    Object.assign(guest, changes);
    saveData(data);

    // re-render keeping the pages already loaded ("ver mais")
    refreshData();
    updateTotal();
    renderRows(true);
  }

  function removeGuest(guest) {
    if (!confirm(`Remover ${guest.name} da lista?`)) return;
    const data = getData();
    data.guests = data.guests.filter((g) => g.id !== guest.id);
    saveData(data);
    refreshData();
    updateTotal();
    renderRows(true);
  }

  function openGuestModal(guest = null) {
    allEvents = getEvents();
    if (allEvents.length === 0) {
      alert("Crie um evento antes de adicionar participantes.");
      return;
    }

    editingGuestId = guest ? guest.id : null;
    modalTitle.textContent = guest ? "Editar Participante" : "Adicionar Participante";
    guestForm.querySelector(".submit-btn").textContent = guest ? "Salvar Alterações" : "Salvar Participante";

    // Event choice inside the modal (defaults to the selected event)
    guestEventSelect.innerHTML = "";
    if (currentEventId === "all" && !guest) {
      guestEventSelect.appendChild(makeOption("", "Selecione o evento"));
    }
    allEvents.forEach((e) => guestEventSelect.appendChild(makeOption(e.id, e.title)));
    guestEventSelect.value = guest ? guest.eventId : (currentEventId === "all" ? "" : currentEventId);

    document.getElementById("guest-name").value = guest ? guest.name || "" : "";
    document.getElementById("guest-contact").value = guest ? guest.contact || "" : "";
    document.getElementById("guest-category").value = guest ? guest.category || "" : "";
    document.getElementById("guest-promoter").value = guest ? guest.promoter || "" : "";
    document.getElementById("guest-notes").value = guest ? guest.notes || "" : "";

    modal.classList.add("show");
    document.getElementById("guest-name").focus();
  }

  function closeGuestModal() {
    modal.classList.remove("show");
    guestForm.reset();
    editingGuestId = null;
  }

  function handleSaveGuest(e) {
    e.preventDefault();

    const eventId = guestEventSelect.value;
    const name = document.getElementById("guest-name").value.trim().replace(/\s+/g, " ");
    const contact = document.getElementById("guest-contact").value.trim();
    const category = document.getElementById("guest-category").value;
    const promoter = document.getElementById("guest-promoter").value.trim();
    const notes = document.getElementById("guest-notes").value.trim();

    if (!name) {
      alert("Por favor, preencha o nome do participante.");
      return;
    }

    if (!eventId) {
      alert("Por favor, selecione um evento para o participante.");
      return;
    }

    const guestsOfEvent = getGuests().filter((g) => g.eventId === eventId && g.id !== editingGuestId);

    // Avoid duplicated names in the same event
    if (guestsOfEvent.some((g) => normalizeText(g.name) === normalizeText(name))) {
      alert(`${name} já está na lista deste evento.`);
      return;
    }

    // Warn when the event capacity is reached
    const event = allEvents.find((ev) => ev.id === eventId);
    const capacity = parseInt(event && event.numero, 10);
    if (capacity > 0 && guestsOfEvent.length >= capacity) {
      const proceed = confirm(
        `A capacidade deste evento (${capacity} pessoas) já foi atingida. Deseja adicionar mesmo assim?`
      );
      if (!proceed) return;
    }

    const fields = { eventId, name, contact, category, promoter, notes };

    if (editingGuestId) {
      const data = getData();
      const guest = data.guests.find((g) => g.id === editingGuestId);
      if (guest) Object.assign(guest, fields);
      saveData(data);
    } else {
      saveGuest({ id: makeId(), ...fields, attended: false });
    }

    const wasEditing = !!editingGuestId;
    closeGuestModal();
    if (wasEditing) {
      refreshData();
      updateTotal();
      renderRows(true);
    } else {
      resetAndRender();
    }
    showToast(wasEditing ? "Participante atualizado!" : "Participante adicionado!");
  }

  // ---------- helpers ----------
  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // Lowercase, trim and remove accents: "João " -> "joao"
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }
});
