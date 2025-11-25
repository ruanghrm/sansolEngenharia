// config.js
const API_URL = "http://69.62.91.145:7899";
const token = localStorage.getItem("access_token");

// se quiser proteger:
if (!token) window.location.href = "login.html";
