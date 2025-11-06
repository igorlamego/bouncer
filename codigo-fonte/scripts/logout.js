function logout() {
  const confirmLogout = confirm("Tem certeza que deseja sair?");
  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("nome");

  window.location.href = "login.html";
}
