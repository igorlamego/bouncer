// Check if a user is logged in
const loggedIn = !!localStorage.getItem("loggedIn");

// Get current page name
// (an empty name means the site root, e.g. https://usuario.github.io/bouncer/)
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Define public pages
const publicPages = ["index.html", "login.html", "cadastro.html"];

// If user is logged in and tries to access a public page, redirect to dashboard
if (loggedIn && publicPages.includes(currentPage)) {
  window.location.href = "dashboard.html";
}

// If user is not logged in and tries to access a private page, redirect to login
if (!loggedIn && !publicPages.includes(currentPage)) {
  window.location.href = "login.html";
}
