import { API_URL, token } from "./config.js";


if (!token) window.location.href = "login.html";

/* -------------------------
   TROCAR ABAS
------------------------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

/* -------------------------
   LOGOUT
------------------------- */
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
});

/* -------------------------
   MODAL CONTROLS
------------------------- */
const modal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelModalBtn = document.getElementById("cancelModal");

function openModal() {
    modal.classList.add("open");
}

function closeModal() {
    modal.classList.remove("open");
}

closeModalBtn.onclick = closeModal;
cancelModalBtn.onclick = closeModal;

window.onclick = (e) => {
    if (e.target === modal) closeModal();
};

/* ============================
   MODAL: ADICIONAR TÉCNICO
============================ */
const modalAddTech = document.getElementById("modalAddTech");
const closeAddTechModal = document.getElementById("closeAddTechModal");
const cancelAddTech = document.getElementById("cancelAddTech");

// abrir modal ao clicar em "Adicionar" na categoria Técnicos
document.querySelectorAll(".add-template-btn[data-type='tech']")
    .forEach(btn => {
        btn.addEventListener("click", () => {
            modalAddTech.classList.add("open");
        });
    });

// fechar modal
closeAddTechModal.onclick = () => modalAddTech.classList.remove("open");
cancelAddTech.onclick = () => modalAddTech.classList.remove("open");

window.addEventListener("click", (e) => {
    if (e.target === modalAddTech) {
        modalAddTech.classList.remove("open");
    }
});


/* -------------------------
   USERS
------------------------- */
async function loadUsers() {
    const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const users = await res.json();
    const list = document.getElementById("usersList");
    const count = document.getElementById("usersCount");

    list.innerHTML = "";
    count.textContent = `${users.length} usuários`;

    users.forEach(u => {
        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <div class="item-info">
                <strong>${u.full_name}</strong><br>
                ${u.email}<br>
                Admin: ${u.is_admin ? "Sim" : "Não"}
            </div>

            <button class="edit-btn" data-id="${u.id}">
                <i class="fas fa-edit"></i> Editar
            </button>
        `;

        list.appendChild(div);
    });

    // Evento de edição (ABRE MODAL)
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.id;
            const user = users.find(us => us.id == userId);

            // Preencher o modal
            document.getElementById("editUserId").value = user.id;
            document.getElementById("editName").value = user.full_name;
            document.getElementById("editEmail").value = user.email;
            document.getElementById("editIsAdmin").checked = user.is_admin;

            // Abre modal
            openModal();
        });
    });
}

document.getElementById("reloadUsers").addEventListener("click", loadUsers);

/* -------------------------
   CRIAR USUÁRIO
------------------------- */
document.getElementById("createUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        full_name: document.getElementById("newName").value,
        email: document.getElementById("newEmail").value,
        password: document.getElementById("newPassword").value,
        is_admin: document.getElementById("newIsAdmin").checked
    };

    await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body)
    });

    alert("Usuário criado!");
    loadUsers();
});

/* -------------------------
   EDITAR USUÁRIO (PATCH)
------------------------- */
document.getElementById("editUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editUserId").value;

    const body = {
        full_name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        is_admin: document.getElementById("editIsAdmin").checked,
    };

    const newPass = document.getElementById("editPassword").value.trim();
    if (newPass.length > 0) body.password = newPass;

    await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    alert("Usuário atualizado!");
    closeModal();
    loadUsers();
});

/* -------------------------
   TEMPLATES
------------------------- */
async function loadTemplates() {
    const res = await fetch(`${API_URL}/templates`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const templates = await res.json();
    const list = document.getElementById("templatesList");
    const count = document.getElementById("templatesCount");

    list.innerHTML = "";
    count.textContent = `${templates.length} templates`;

    templates.forEach(t => {
        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <strong>${t.name}</strong><br>
            ID: ${t.id}<br>
            <button class="delete" data-id="${t.id}">
                <i class="fas fa-trash"></i> Deletar
            </button>
        `;

        list.appendChild(div);
    });

    document.querySelectorAll(".delete").forEach(btn => {
        btn.onclick = async () => {
            if (!confirm("Deletar template?")) return;

            await fetch(`${API_URL}/templates/${btn.dataset.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            loadTemplates();
        };
    });
}

document.getElementById("reloadTemplates").addEventListener("click", loadTemplates);

/* -------------------------
   CARREGAR AO INICIAR
------------------------- */
loadUsers();
loadTemplates();
loadTechnicians();

