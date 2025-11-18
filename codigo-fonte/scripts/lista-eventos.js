document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".event-list");

  let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  container.innerHTML = "";

  if (eventos.length === 0) {
    container.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
    return;
  }

  eventos.forEach((evento, index) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${evento.data}</p>
      <p><strong>Local:</strong> ${evento.local}</p>
      <p><strong>Descrição:</strong> ${evento.descricao}</p>

      <a class="pill-btn" href="evento.html?id=${index}">Ver detalhes</a>

      <button class="delete-btn" data-index="${index}">
          Excluir
      </button>
    `;

    container.appendChild(card);
  });

  // ===== EXCLUIR EVENTO =====
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");

      if (confirm("Tem certeza que deseja excluir este evento?")) {
        eventos.splice(idx, 1);
        localStorage.setItem("eventos", JSON.stringify(eventos));
        location.reload(); // recarrega a lista atualizada
      }
    });
  });
});
