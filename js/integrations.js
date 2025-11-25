console.log("✔ integrations.js carregado");

// ===================================================================
//  CRIAR TÉCNICO (POST /technicians)
// ===================================================================
async function createTechnician(data) {
    console.log("📤 Enviando técnico para API:", data);

    const res = await fetch(`${API_URL}/technicians`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro da API:", err);
        throw new Error("Erro ao criar técnico: " + err);
    }

    const created = await res.json();
    console.log("✅ Técnico criado:", created);
    return created;
}

// ===================================================================
//  SUBMISSÃO DO FORMULÁRIO DO MODAL DE TÉCNICO (CADASTRO)
// ===================================================================
document.getElementById("formAddTech").addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const mapping = {
        nomeTecnico: "NomeTecnico",
        tituloTecnico: "TituloTecnico",
        registroTecnico: "RegistroTecnico",
        ufTecnico: "UfTecnico",
        emailTecnico: "EmailTecnico",
        telefoneFixoTecnico: "TelefoneTecnico",
        celularTecnico: "CelularTecnico",
        faxTecnico: "faxTecnico",
        enderecoTecnico: "EnderecoTecnico",
        bairroTecnico: "BairroTecnico",
        cidadeTecnico: "MunicipioTecnico",
        ufTecnicoEndereco: "UfTecnico2",
        cepTecnico: "CEPTecnico"
    };

    const payload = {};
    for (const backendField in mapping) {
        const el = document.getElementById(mapping[backendField]);
        if (!el) return alert(`Campo ausente no HTML: ${mapping[backendField]}`);
        payload[backendField] = el.value.trim();
    }

    try {
        await createTechnician(payload);
        alert("Técnico criado com sucesso!");
        modalAddTech.classList.remove("open");
        loadTechnicians();
    } catch (err) {
        alert(err.message);
    }
});

// ===================================================================
//  LISTAR TÉCNICOS (GET /technicians)
// ===================================================================
async function loadTechnicians() {
    try {
        const res = await fetch(`${API_URL}/technicians`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return console.error("Erro ao carregar técnicos:", await res.text());

        const technicians = await res.json();
        const list = document.getElementById("templatesListTech");
        const count = document.getElementById("templatesCountTech");

        list.innerHTML = "";
        count.textContent = technicians.length;

        technicians.forEach(t => {
            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <div class="item-info">
                    <strong>${t.nomeTecnico}</strong><br>
                    ${t.tituloTecnico}<br>
                    CREA: ${t.registroTecnico}<br>
                    Cidade: ${t.cidadeTecnico}
                </div>

                <button class="edit edit-tech" data-id="${t.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>

                <button class="delete delete-tech" data-id="${t.id}">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            `;

            list.appendChild(div);
        });

        // Deletar técnico
        document.querySelectorAll(".delete-tech").forEach(btn => {
            btn.onclick = async () => {
                if (!confirm("Tem certeza que deseja deletar este técnico?")) return;
                const id = btn.dataset.id;
                const delRes = await fetch(`${API_URL}/technicians/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (delRes.ok) {
                    alert("Técnico deletado com sucesso!");
                    loadTechnicians();
                } else alert("Erro ao deletar técnico");
            };
        });

        // Editar técnico - abrir modal
        document.querySelectorAll(".edit-tech").forEach(btn => {
            btn.onclick = () => openEditTechModal(btn.dataset.id, technicians);
        });

    } catch (err) {
        console.error("Erro no loadTechnicians:", err);
    }
}

window.loadTechnicians = loadTechnicians;

// ===================================================================
//  MODAL DE EDIÇÃO DE TÉCNICO
// ===================================================================
const modalEditTech = document.getElementById("modalEditTech");
const closeEditTechModal = document.getElementById("closeEditTechModal");
const cancelEditTech = document.getElementById("cancelEditTech");

function openEditTechModal(id, technicians) {
    const t = technicians.find(x => x.id == id);
    if (!t) return alert("Técnico não encontrado");

    document.getElementById("editTechId").value = t.id;
    document.getElementById("editNomeTecnico").value = t.nomeTecnico || "";
    document.getElementById("editTituloTecnico").value = t.tituloTecnico || "";
    document.getElementById("editRegistroTecnico").value = t.registroTecnico || "";
    document.getElementById("editUfTecnico").value = t.ufTecnico || "";
    document.getElementById("editEmailTecnico").value = t.emailTecnico || "";
    document.getElementById("editTelefoneTecnico").value = t.telefoneFixoTecnico || "";
    document.getElementById("editCelularTecnico").value = t.celularTecnico || "";
    document.getElementById("editFaxTecnico").value = t.faxTecnico || "";
    document.getElementById("editEnderecoTecnico").value = t.enderecoTecnico || "";
    document.getElementById("editBairroTecnico").value = t.bairroTecnico || "";
    document.getElementById("editMunicipioTecnico").value = t.cidadeTecnico || "";
    document.getElementById("editUfTecnico2").value = t.ufTecnicoEndereco || "";
    document.getElementById("editCEPTecnico").value = t.cepTecnico || "";

    modalEditTech.classList.add("open");
}

closeEditTechModal.onclick = cancelEditTech.onclick = () => modalEditTech.classList.remove("open");

window.addEventListener("click", e => {
    if (e.target === modalEditTech) modalEditTech.classList.remove("open");
});

// ===================================================================
//  SUBMISSÃO DO FORMULÁRIO DE EDIÇÃO DE TÉCNICO (PUT /technicians/{id})
// ===================================================================
document.getElementById("formEditTech").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editTechId").value;

    const payload = {
        nomeTecnico: document.getElementById("editNomeTecnico").value.trim(),
        tituloTecnico: document.getElementById("editTituloTecnico").value.trim(),
        registroTecnico: document.getElementById("editRegistroTecnico").value.trim(),
        ufTecnico: document.getElementById("editUfTecnico").value.trim(),
        emailTecnico: document.getElementById("editEmailTecnico").value.trim(),
        telefoneFixoTecnico: document.getElementById("editTelefoneTecnico").value.trim(),
        celularTecnico: document.getElementById("editCelularTecnico").value.trim(),
        faxTecnico: document.getElementById("editFaxTecnico").value.trim(),
        enderecoTecnico: document.getElementById("editEnderecoTecnico").value.trim(),
        bairroTecnico: document.getElementById("editBairroTecnico").value.trim(),
        cidadeTecnico: document.getElementById("editMunicipioTecnico").value.trim(),
        ufTecnicoEndereco: document.getElementById("editUfTecnico2").value.trim(),
        cepTecnico: document.getElementById("editCEPTecnico").value.trim()
    };

    try {
        const res = await fetch(`${API_URL}/technicians/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(await res.text());

        alert("Técnico atualizado com sucesso!");
        modalEditTech.classList.remove("open");
        loadTechnicians();
    } catch (err) {
        alert("Erro ao atualizar técnico: " + err.message);
    }
});


async function loadTemplates() {
    try {
        const res = await fetch(`${API_URL}/templates`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ Erro ao carregar templates:", errText);
            return;
        }

        const templates = await res.json();
        console.log("📦 Templates carregados:", templates);

        const modulesList = document.getElementById("templatesListModules");
        const invertersList = document.getElementById("templatesListInverters");
        const modulesCount = document.getElementById("templatesCountModules");
        const invertersCount = document.getElementById("templatesCountInverters");

        modulesList.innerHTML = "";
        invertersList.innerHTML = "";

        // --- MÓDULOS ---
        const modules = templates.filter(t => t.type === "modulo");
        modules.forEach(t => {
            const div = document.createElement("div");
            div.className = "item";
            
            div.innerHTML = `
                <strong>${t.name}</strong><br>
                Modelo: ${t.data?.ModeloModulo1 || "-"}<br>
                Fabricante: ${t.data?.FabricanteModulo1 || "-"}<br>
                Potência: ${t.data?.PotenciaValor1 || "-"} kW<br>
                Área: ${t.data?.AreaValor1 || "-"} m²<br>
                Corrente Disjuntor: ${t.data?.CorrenteDisjuntor || "-"} A
                <button class="delete delete-template" data-id="${t.id}" data-type="modulo">
                    <i class="fas fa-trash"></i> Deletar
                </button>

            `;
            modulesList.appendChild(div);
        });
        modulesCount.textContent = modules.length;

        // --- INVERSORES ---
        const inverters = templates.filter(t => t.type === "inversor");
        inverters.forEach(t => {
            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <strong>${t.name}</strong><br>
                Modelo: ${t.data?.ModeloInversor1 || "-"}<br>
                Fabricante: ${t.data?.FabricanteInversor1 || "-"}<br>
                Potência: ${t.data?.potenciaInversorTotal || "-"} kW<br>
                Corrente Nominal: ${t.data?.CorrenteNominalInversor1 || "-"} A<br>
                Eficiência Máxima: ${t.data?.EficienciaMaxima || "-"} %
                <button class="delete delete-template" data-id="${t.id}" data-type="inversor">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            `;
            invertersList.appendChild(div);
        });
        invertersCount.textContent = inverters.length;

        // --- BOTÕES DE DELETE ---
        document.querySelectorAll(".delete-template").forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const tipo = btn.dataset.type;
                if (!confirm(`Tem certeza que deseja deletar este template (${tipo})?`)) return;

                try {
                    const delRes = await fetch(`${API_URL}/templates/${id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (delRes.status === 204) {
                        alert("Template deletado com sucesso!");
                        loadTemplates(); // Recarrega a lista
                    } else {
                        const text = await delRes.text();
                        alert("Erro ao deletar template: " + text);
                    }
                } catch (err) {
                    console.error("Erro ao deletar template:", err);
                    alert("Erro ao deletar template");
                }
            };
        });

    } catch (err) {
        console.error("Erro no loadTemplates:", err);
    }
}

// Chamar a função
loadTemplates();

