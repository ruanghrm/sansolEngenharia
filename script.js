window.addEventListener("DOMContentLoaded", () => {
    const totalPotencia = document.getElementById("PotenciaPico");
    const totalQtd = document.getElementById("QtdModulo");
    const totalArea = document.getElementById("AreaModulo");
    const tableBody = document.querySelector(".ug-table tbody");

    let currentRows = 1;
    const maxRows = 10;

    // --- Calcula potência de pico por linha ---
    function calcularLinha(index) {
        const potenciaModulo = document.getElementById(`PotenciaModulo${index}`);
        const quantidade = document.getElementById(`QuantidadeValor${index}`);
        const potenciaPico = document.getElementById(`PotenciaValor${index}`);

        if (!potenciaModulo || !quantidade || !potenciaPico) return;

        const potenciaW = parseFloat(potenciaModulo.value.replace(",", ".")) || 0;
        const qtd = parseInt(quantidade.value) || 0;
        const resultado = (potenciaW * qtd) / 1000; // W -> kW

        potenciaPico.value = resultado
            ? resultado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "";
    }

    // --- Atualiza totais gerais (Potência, Quantidade, Área) ---
    function atualizarTotais() {
    let somaPotencia = 0;
    let somaQtd = 0;
    let somaArea = 0;

    // Busca apenas as linhas existentes no DOM
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        const i = index + 1; // já que o id começa em 1
        calcularLinha(i);

        const potencia = document.getElementById(`PotenciaValor${i}`);
        const qtd = document.getElementById(`QuantidadeValor${i}`);
        const area = document.getElementById(`AreaValor${i}`);

        if (potencia && potencia.value)
            somaPotencia += parseFloat(potencia.value.replace(",", ".")) || 0;
        if (qtd && qtd.value)
            somaQtd += parseInt(qtd.value) || 0;
        if (area && area.value)
            somaArea += parseFloat(area.value.replace(",", ".")) || 0;
    });

    if (totalPotencia)
        totalPotencia.value = somaPotencia.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (totalQtd)
        totalQtd.value = somaQtd;
    if (totalArea)
        totalArea.value = somaArea.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- Adiciona listeners para cada linha ---
    function addListenersForRow(index) {
        const potenciaModulo = document.getElementById(`PotenciaModulo${index}`);
        const quantidade = document.getElementById(`QuantidadeValor${index}`);
        const area = document.getElementById(`AreaValor${index}`);

        if (potenciaModulo) {
            potenciaModulo.addEventListener("input", atualizarTotais);
            potenciaModulo.addEventListener("change", atualizarTotais);
        }
        if (quantidade) {
            quantidade.addEventListener("input", atualizarTotais);
            quantidade.addEventListener("change", atualizarTotais);
        }
        if (area) {
            area.addEventListener("input", atualizarTotais);
            area.addEventListener("change", atualizarTotais);
        }
    }

    // --- Adiciona uma nova linha na tabela ---
    function adicionarLinha() {
        if (currentRows >= maxRows) return;
        currentRows++;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${currentRows}</td>
            <td><input type="text" id="PotenciaModulo${currentRows}" name="PotenciaModulo${currentRows}" placeholder="W"></td>
            <td><input type="text" id="QuantidadeValor${currentRows}" name="QuantidadeValor${currentRows}" placeholder="Qtd"></td>
            <td><input type="text" step="0.01" id="PotenciaValor${currentRows}" name="PotenciaValor${currentRows}" placeholder="kWp" readonly></td>
            <td><input type="text" step="0.01" id="AreaValor${currentRows}" name="AreaValor${currentRows}" placeholder="m²"></td>
            <td><input type="text" id="FabricanteModulo${currentRows}" name="FabricanteModulo${currentRows}" placeholder="Fabricante"></td>
            <td><input type="text" id="ModeloModulo${currentRows}" name="ModeloModulo${currentRows}" placeholder="Modelo"></td>
        `;
        tableBody.appendChild(newRow);
        addListenersForRow(currentRows);
    }

    // --- Configura as linhas iniciais ---
    for (let i = 1; i <= maxRows; i++) {
        addListenersForRow(i);
    }
    atualizarTotais();

    // --- Cria botão de adicionar linha ---
    const btnAdd = document.createElement("button");
    btnAdd.type = "button";
    btnAdd.innerHTML = "+";
    btnAdd.classList.add("btn-add-row");
    btnAdd.addEventListener("click", adicionarLinha);
    document.querySelector(".table-container").appendChild(btnAdd);

    // 🔹 Garante que os campos de totais sejam somente leitura
    if (totalPotencia) totalPotencia.readOnly = true;
    if (totalQtd) totalQtd.readOnly = true;
    if (totalArea) totalArea.readOnly = true;
});

window.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.querySelector(".table-container2");
    const tableBody = tableContainer.querySelector("tbody");
    const totalPotenciaInput = tableContainer.querySelector("#PotenciaInversorTotal");

    let currentRow = 1;
    const maxRows = 30;

    // --- Atualiza total da coluna PotenciaValorInversor ---
    function atualizarTotalPotencia() {
        let soma = 0;
        for (let i = 1; i <= currentRow; i++) {
            const potenciaInput = tableContainer.querySelector(`#PotenciaValorInversor${i}`);
            if (potenciaInput && potenciaInput.value) {
                soma += parseFloat(potenciaInput.value.replace(",", ".")) || 0;
            }
        }
        if (totalPotenciaInput) {
            totalPotenciaInput.value = soma.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    // Adiciona listener na primeira linha
    const primeiraPotencia = tableContainer.querySelector("#PotenciaValorInversor1");
    if (primeiraPotencia) primeiraPotencia.addEventListener("input", atualizarTotalPotencia);

    // --- Função para adicionar nova linha ---
    function adicionarLinha() {
        if (currentRow >= maxRows) return;
        currentRow++;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${currentRow}</td>
            <td><input type="text" id="FabricanteInversor${currentRow}" name="FabricanteInversor${currentRow}" placeholder="Fabricante"></td>
            <td><input type="text" id="ModeloInversor${currentRow}" name="ModeloInversor${currentRow}" placeholder="Modelo"></td>
            <td><input type="text" step="0.01" id="PotenciaValorInversor${currentRow}" name="PotenciaValorInversor${currentRow}" placeholder="kW"></td>
            <td><input type="text" id="FaixaTensaoInversor${currentRow}" name="FaixaTensaoInversor${currentRow}" placeholder="V"></td>
            <td><input type="text" step="0.01" id="CorrenteNominalInversor${currentRow}" name="CorrenteNominalInversor${currentRow}" placeholder="A"></td>
            <td><input type="text" step="0.01" id="FPInversor${currentRow}" name="FPInversor${currentRow}" placeholder="FP"></td>
            <td><input type="text" step="0.01" id="RendimentoInversor${currentRow}" name="RendimentoInversor${currentRow}" placeholder="%"></td>
            <td><input type="text" step="0.01" id="DHTInversor${currentRow}" name="DHTInversor${currentRow}" placeholder="%"></td>
        `;

        tableBody.appendChild(newRow);

        // Adiciona listener para atualizar total na nova linha
        const novaPotencia = tableContainer.querySelector(`#PotenciaValorInversor${currentRow}`);
        if (novaPotencia) novaPotencia.addEventListener("input", atualizarTotalPotencia);
    }

    // --- Cria botão de adicionar linha ---
    const btnAdd = document.createElement("button");
    btnAdd.type = "button";
    btnAdd.innerText = "+";
    btnAdd.classList.add("btn-add-row");
    btnAdd.addEventListener("click", adicionarLinha);

    tableContainer.appendChild(btnAdd);

    // --- Torna o campo total somente leitura ---
    if (totalPotenciaInput) totalPotenciaInput.readOnly = true;
});


document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleTecnico"); // header clicável
    const conteudo = document.getElementById("conteudoTecnico"); // div com os campos
    const seta = document.getElementById("setaTecnico"); // span da seta

    if (!toggle || !conteudo || !seta) return; // segurança

    let aberto = true; // estado inicial: aberto

    toggle.addEventListener("click", () => {
        aberto = !aberto;
        if (aberto) {
            conteudo.style.display = "block";        // mostra conteúdo
            seta.style.transform = "rotate(0deg)";   // seta para a direita
        } else {
            conteudo.style.display = "none";         // esconde conteúdo
            seta.style.transform = "rotate(90deg)";  // seta para baixo
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const modalidadeSelect = document.getElementById("ModalidadeCompensacao");

    // Cria container para os campos extras
    const containerExtras = document.createElement("div");
    containerExtras.id = "extrasCompensacao";
    containerExtras.style.marginTop = "10px";

    modalidadeSelect.parentNode.parentNode.appendChild(containerExtras);

    modalidadeSelect.addEventListener("change", function() {
        const valor = modalidadeSelect.value;
        containerExtras.innerHTML = ""; // limpa campos existentes

        const valoresComExtras = [
            "AUTOCONSUMO REMOTO",
            "GERAÇÃO COMPARTILHADA",
            "EMPREENDIMENTO DE MÚLTIPLAS UNIDADES CONSUMIDORAS"
        ];

        if (valoresComExtras.includes(valor)) {
            // Campo Forma de alocação dos créditos
            const divForma = document.createElement("div");
            divForma.className = "form-group";
            const labelForma = document.createElement("label");
            labelForma.setAttribute("for", "FormaAlocacao");
            labelForma.textContent = "Forma de alocação dos créditos";
            const selectForma = document.createElement("select");
            selectForma.id = "FormaAlocacao";
            selectForma.name = "FormaAlocacao";

            const option1 = document.createElement("option");
            option1.value = "Percentual do Excedente";
            option1.textContent = "Percentual do Excedente";

            const option2 = document.createElement("option");
            option2.value = "Ordem de Prioridade";
            option2.textContent = "Ordem de Prioridade";

            selectForma.appendChild(option1);
            selectForma.appendChild(option2);

            divForma.appendChild(labelForma);
            divForma.appendChild(selectForma);
            containerExtras.appendChild(divForma);

            // Campo informativo
            const divInfo = document.createElement("div");
            divInfo.className = "form-group";
            divInfo.innerHTML = "<strong>PREENCHER LISTA DE RATEIO DE CLIENTES NA GUIA 2 (OPCIONAL)</strong>";
            containerExtras.appendChild(divInfo);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const tipoSelect = document.getElementById("TipoSolicitacao");

    // Container para o campo informativo
    const containerInfo = document.createElement("div");
    containerInfo.id = "infoTipoSolicitacao";
    containerInfo.style.marginTop = "8px";
    containerInfo.style.width = "100%";
    containerInfo.style.display = "block";
    containerInfo.style.fontWeight = "bold";

    // Container para o campo de potência existente (input + kW)
    const containerPotencia = document.createElement("div");
    containerPotencia.id = "containerPotencia";
    containerPotencia.style.marginTop = "8px";
    containerPotencia.style.display = "flex";
    containerPotencia.style.alignItems = "center";
    containerPotencia.style.gap = "5px"; // espaço entre label, input e unidade
    containerPotencia.style.width = "100%";
    containerPotencia.style.fontWeight = "normal"; // menos chamativo que o texto informativo

    // Label
    const labelPotencia = document.createElement("label");
    labelPotencia.innerText = "Potência de Geração Existente";

    // Input
    const inputPotencia = document.createElement("input");
    inputPotencia.type = "text";
    inputPotencia.id = "PotenciaDeGeracaoExistente";
    inputPotencia.name = "PotenciaDeGeracaoExistente";
    inputPotencia.placeholder = "Valor";

    // Unidade
    const unidade = document.createElement("span");
    unidade.innerText = "kW";

    containerPotencia.appendChild(labelPotencia);
    containerPotencia.appendChild(inputPotencia);
    containerPotencia.appendChild(unidade);

    // Inserir ambos os containers (informativo e input) abaixo do form-group
    const parentGroup = tipoSelect.closest(".form-group");
    parentGroup.appendChild(containerInfo);
    parentGroup.appendChild(containerPotencia);

    // Esconder inicialmente
    containerInfo.innerHTML = "";
    containerPotencia.style.display = "none";

    tipoSelect.addEventListener("change", function() {
        const valor = tipoSelect.value;
        containerInfo.innerHTML = "";
        containerPotencia.style.display = "none";

        switch(valor) {
            case "CONEXÃO DE GD EM UNIDADE CONSUMIDORA EXISTENTE SEM AUMENTO DE POTÊNCIA DISPONIBILIZADA (ver item abaixo)":
                containerInfo.innerHTML = "INFORMAR O NÚMERO DA CONTA CONTRATO";
                break;
            case "CONEXÃO DE GD EM UNIDADE CONSUMIDORA EXISTENTE COM AUMENTO DE POTÊNCIA DISPONIBILIZADA (ver item abaixo)":
                containerInfo.innerHTML = "INFORMAR O NÚMERO DA CONTA CONTRATO E PREENCHER O FORMULÁRIO DE TROCA PADRÃO NO ANEXO IV";
                break;
            case "AUMENTO DA POTÊNCIA DE GERAÇÃO EM UC COM GD EXISTENTE SEM AUMENTO DE POTÊNCIA DISPONIBILIZADA (ver item abaixo)":
                containerInfo.innerHTML = "INFORMAR NÚMERO DA CONTA CONTRATO E POTÊNCIA DA GD EXISTENTE";
                containerPotencia.style.display = "flex"; // mostra o input
                break;
            case "AUMENTO DA POTÊNCIA DE GERAÇÃO EM UC COM GD EXISTENTE COM AUMENTO DE POTÊNCIA DISPONIBILIZADA (ver item abaixo)":
                containerInfo.innerHTML = "INFORMAR NÚMERO DA CONTA CONTRATO, POTÊNCIA DA GD EXISTENTE E PREENCHER ANEXO IV";
                break;
            default:
                containerInfo.innerHTML = "";
                containerPotencia.style.display = "none";
        }
    });
});

function enriquecerJson(jsonData) {
    // --- Polos do disjuntor ---
    if (jsonData["#TipoLigacao"] === "BIFÁSICO") {
        jsonData["#PolosDisjuntor"] = "2P";
    } else if (jsonData["#TipoLigacao"] === "TRIFÁSICO") {
        jsonData["#PolosDisjuntor"] = "3P";
    }

    // --- Regras de cabos ---
    const regrasCabos = {
        "2P-63 A": { tipo: "TRIPLEX", secao: "16" },
        "2P-70 A": { tipo: "TRIPLEX", secao: "16" },
        "3P-70 A": { tipo: "QUADRUPLEX", secao: "25" },
        "3P-100 A": { tipo: "QUADRUPLEX", secao: "35" },
        "3P-125 A": { tipo: "QUADRUPLEX", secao: "50" },
        "3P-150 A": { tipo: "QUADRUPLEX", secao: "70" },
        "3P-175 A": { tipo: "QUADRUPLEX", secao: "95" },
        "3P-200 A": { tipo: "QUADRUPLEX", secao: "95" }
    };

    const chave = `${jsonData["#PolosDisjuntor"] || ""}-${jsonData["#DisjuntorEntrada"] || ""}`;
    if (regrasCabos[chave]) {
        jsonData["#TipoCabo"] = regrasCabos[chave].tipo;
        jsonData["#SecaoCabo"] = regrasCabos[chave].secao;
    }

    // --- Dados fixos ---
    jsonData["#Termomagnetico"] = "TERMOMAGNÉTICO";
    jsonData["#FrequenciaNominal"] = "60";
    jsonData["#CapacidadeMaxInterrupcao"] = "10";
    jsonData["#CurvaAtuacao"] = "C";
    jsonData["#FPDado"] = "0,92";
    jsonData["#CapacidadeMaxAtuacao"] = "3";

    if (jsonData["#TipoLigacao"] === "MONOFÁSICO" || jsonData["#TipoLigacao"] === "BIFÁSICO") {
        jsonData["#NFdado"] = "1";
    } else if (jsonData["#TipoLigacao"] === "TRIFÁSICO") {
        jsonData["#NFdado"] = "√3";
    }

    // --- Potência de geração ---
    const potenciaPico = parseFloat((document.getElementById("PotenciaPico")?.value || "0").replace(",", ".")) || 0;
    const potenciaInversor = parseFloat((document.getElementById("PotenciaInversorTotal")?.value || "0").replace(",", ".")) || 0;
    const menorValor = Math.min(potenciaPico, potenciaInversor);

    jsonData["#PotenciaGeracaoOrcamento"] = menorValor;
    jsonData["#PotenciaGeracaoPGT"] = menorValor;

    // --- Lógica Potência Disponibilizada ---
    const tipo = jsonData["#TipoLigacao"];
    const disjuntor = jsonData["#DisjuntorEntrada"];
    const tensao = jsonData["#TensaoAtendimento"];

    const regrasPotencia = {
        "BIFÁSICO": {
            "50 A": { "220": 10 },
            "60 A": { "220": 12 },
            "63 A": { "220": 12 },
            "70 A": { "220": 15 }
        },
        "TRIFÁSICO": {
            "40 A": { "220": 15 },
            "50 A": { "220": 17 },
            "60 A": { "220": 21 },
            "63 A": { "220": 22 },
            "70 A": { "220": 24 },
            "80 A": { "220": 28 },
            "100 A": { "220": 35 },
            "125 A": { "220": 44 },
            "150 A": { "220": 52 },
            "175 A": { "220": 61 },
            "200 A": { "220": 75 }
        }
    };

    let potenciaDisp = "";
    if (regrasPotencia[tipo] && regrasPotencia[tipo][disjuntor] && regrasPotencia[tipo][disjuntor][tensao]) {
        // Formata para duas casas decimais, com vírgula
        potenciaDisp = regrasPotencia[tipo][disjuntor][tensao].toFixed(2).replace(".", ",");
    }

    jsonData["#PotenciaDisponibilizada"] = potenciaDisp;

    return jsonData;
}

// --- Envio do formulário ---
document.getElementById("orcamentoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    let jsonData = {};

    form.querySelectorAll("input, select").forEach(field => {
        if (!field.id) return;
        const key = "#" + field.id;
        jsonData[key] = field.value;
    });

    jsonData = enriquecerJson(jsonData);

    console.log("JSON a enviar:", jsonData);

    fetch("http://69.62.91.145:7899/render?type=both", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao gerar arquivo");
        const disposition = response.headers.get("Content-Disposition");
        let filename = "arquivo_gerado.zip";
        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/["']/g, "");
        }
        return response.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error("Erro:", error));
});
