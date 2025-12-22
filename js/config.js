// config.js
export const API_URL = "https://api.quantumprojects.com.br";
export const token = localStorage.getItem("access_token");

if (!token) window.location.href = "login.html";
