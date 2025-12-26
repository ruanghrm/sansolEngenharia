const API_URL = "https://api.quantumprojects.com.br";

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const status = document.getElementById("status");

    status.textContent = "Entrando...";
    status.style.color = "black";

    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        });

        const data = await response.json();

        if (!response.ok) {
            status.textContent = data.detail || "Falha ao fazer login";
            status.style.color = "red";
            return;
        }

        // salva o token no localStorage
        localStorage.setItem("access_token", data.access_token);

        // agora verificamos se o usuário é admin
        const meRes = await fetch(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${data.access_token}`
            }
        });

        const me = await meRes.json();

        if (!meRes.ok) {
            status.textContent = "Erro ao validar usuário.";
            status.style.color = "red";
            return;
        }

        status.textContent = "Login bem-sucedido!";
        status.style.color = "green";

        // redirecionamento baseado no tipo de usuário
        setTimeout(() => {
            if (me.is_admin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 800);

    } catch (error) {
        status.textContent = "Erro ao conectar com o servidor.";
        status.style.color = "red";
        console.error(error);
    }
});
