// config.js
export const API_URL = "http://69.62.91.145:7899";
export const token = localStorage.getItem("access_token");

if (!token) window.location.href = "login.html";
