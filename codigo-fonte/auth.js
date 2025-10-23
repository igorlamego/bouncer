const loggedIn = localStorage.getItem("loggedIn") === "true";
const currentPage = window.location.pathname.split("/").pop();

const publicPages = ["index.html", "login.html", "register.html"];

if (loggedIn && publicPages.includes(currentPage)) {
  window.location.href = "dashboard.html";
}

if (!loggedIn && !publicPages.includes(currentPage)) {
  window.location.href = "login.html";
}
