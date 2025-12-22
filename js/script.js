import { API_URL, token } from './config.js';

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
            <td><input type="text" step="0.01" id="PotenciaValor${currentRows}" name="PotenciaValor${currentRows}" placeholder="kWp"></td>
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

document.addEventListener("DOMContentLoaded", function () {
    const modalidadeSelect = document.getElementById("ModalidadeCompensacao");

    // Cria container para os campos extras
    const containerExtras = document.createElement("div");
    containerExtras.id = "extrasCompensacao";
    containerExtras.style.marginTop = "10px";

    modalidadeSelect.parentNode.parentNode.appendChild(containerExtras);

    modalidadeSelect.addEventListener("change", function () {
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

document.addEventListener("DOMContentLoaded", function () {
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

    tipoSelect.addEventListener("change", function () {
        const valor = tipoSelect.value;
        containerInfo.innerHTML = "";
        containerPotencia.style.display = "none";

        switch (valor) {
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

// --- Cálculo de Área dos Módulos ---
let areaModulo = 0; // Guarda a área de 1 módulo em m²

const larguraInput = document.getElementById("LarguraModulo");
const alturaInput = document.getElementById("AlturaModulo");

// Função para calcular a área (mm -> m²)
function calcularAreaModulo() {
    const largura = parseFloat(larguraInput.value) || 0;
    const altura = parseFloat(alturaInput.value) || 0;

    // Converte mm² para m²
    areaModulo = (largura * altura) / 1_000_000;

    atualizarAreas(); // recalcula todas as linhas quando a área muda
}

// Escuta mudanças nos campos de largura/altura
larguraInput.addEventListener("input", calcularAreaModulo);
alturaInput.addEventListener("input", calcularAreaModulo);


// --- Função para atualizar áreas das linhas ---
function atualizarAreas() {
    const linhas = document.querySelectorAll("tr");
    linhas.forEach((linha) => {
        const qtdInput = linha.querySelector("input[id^='QuantidadeValor']");
        const areaInput = linha.querySelector("input[id^='AreaValor']");

        if (qtdInput && areaInput) {
            const quantidade = parseFloat(qtdInput.value) || 0;
            const areaTotal = quantidade * areaModulo;
            areaInput.value = areaTotal > 0 ? areaTotal.toFixed(2).replace(".", ",") : "";
        }
    });
}

// Escutar mudanças de quantidade para recalcular
document.addEventListener("input", function (e) {
    if (e.target && e.target.id.startsWith("QuantidadeValor")) {
        atualizarAreas();
    }
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
    jsonData["#GeracaoMedia"] = (potenciaPico * 110).toFixed(2).replace(".", ",");

    // --- Contar linhas da tabela de inversores ---
    const tabelaInversores = document.querySelectorAll("tr"); // você pode usar um seletor mais específico se houver várias tabelas
    let quantidadeLinhas = 0;

    tabelaInversores.forEach(tr => {
        // Só contar linhas que tenham inputs de inversor
        if (tr.querySelector("input[id^='FabricanteInversor']")) {
            quantidadeLinhas++;
        }
    });

    jsonData["#QuantidadeTotalInversor"] = quantidadeLinhas;

    // --- Lógica Potência Disponibilizada ---
    const tipo = jsonData["#TipoLigacao"];
    const disjuntor = jsonData["#DisjuntorEntrada"];
    const tensao = jsonData["#TensaoAtendimento"];

    const regrasPotencia = {
        "MONOFÁSICO": {
            "20": { "127": 3.00 },
            "25": { "127": 3.00 },
            "30": { "127": 3.50 },
            "32": { "127": 3.50 },
            "40": { "127": 5.00 },
            "50": { "127": 6.00 },
            "60": { "127": 8.00 },
            "63": { "127": 8.00 },
            "70": { "127": 9.00 },
            "80": { "127": 10.00 }
        },
        "BIFÁSICO": {
            "50": { "220": 10.00 },
            "60": { "220": 12.00 },
            "63": { "220": 12.00 },
            "70": { "220": 15.00 }
        },
        "TRIFÁSICO": {
            "40": { "220": 15.00 },
            "50": { "220": 17.00 },
            "60": { "220": 21.00 },
            "63": { "220": 22.00 },
            "70": { "220": 24.00 },
            "80": { "220": 28.00 },
            "100": { "220": 35.00 },
            "125": { "220": 44.00 },
            "150": { "220": 52.00 },
            "175": { "220": 61.00 },
            "200": { "220": 75.00 }
        }
    };

    let potenciaDisp = "";
    if (regrasPotencia[tipo] && regrasPotencia[tipo][disjuntor] && regrasPotencia[tipo][disjuntor][tensao]) {
        potenciaDisp = regrasPotencia[tipo][disjuntor][tensao].toFixed(2).replace(".", ",");
    }

    jsonData["#PotenciaDisponibilizada"] = potenciaDisp;

    // --- Check Análise ---
    const pgt = parseFloat(jsonData["#PotenciaGeracaoPGT"].toString().replace(",", ".")) || 0;
    const pd = parseFloat(jsonData["#PotenciaDisponibilizada"].toString().replace(",", ".")) || 0;

    console.log("PGT:", pgt, "PD:", pd, jsonData);

    if (!pgt || !pd) {
        jsonData["#CheckAnali"] = "";
    } else if (pgt <= 75) {
        if (pgt <= pd) {
            jsonData["#CheckAnali"] = "OK: PGT ≤ PD";
        } else {
            jsonData["#CheckAnali"] = "NOK: PGT > PD";
        }
    } else {
        jsonData["#CheckAnali"] = "PGT ACIMA DO LIMITE DO GRUPO B";
    }

    // --- Dimensões do módulo ---
    const largura = document.getElementById("LarguraModulo")?.value || "";
    const altura = document.getElementById("AlturaModulo")?.value || "";
    if (largura && altura) {
        jsonData["#DimensoesModulo"] = `${largura} x ${altura}`;
    } else {
        jsonData["#DimensoesModulo"] = "";
    }

    // --- Dados fixos ---
    jsonData["#Termomagnetico"] = "TERMOMAGNÉTICO";
    jsonData["#FrequenciaNominal"] = "60";
    jsonData["#CapacidadeMaxInterrupcao"] = "10";
    jsonData["#CurvaAtuacao"] = "C";
    jsonData["#FPDado"] = "0,92";
    jsonData["#CapacidadeMaxAtuacao"] = "3";

    // Converte potenciaDisp (string com vírgula) de volta para número
    let potenciaDispNumero = parseFloat(potenciaDisp.replace(",", ".")) || 0;

    // Faz o cálculo
    let pdkva = potenciaDispNumero / 0.92;

    jsonData["#PDkva"] = pdkva.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // --- Corrente Nominal (Corrige Norminal) ---
    const correnteNominal = document.getElementById("CorrenteNominalInversor1")?.value || "";
    jsonData["#CorrenteNorminalInversor1"] = correnteNominal;

    const numeroPoste = document.getElementById("IdentificacaoPoste")?.value || "";
    jsonData["#NumeroPoste"] = numeroPoste;

    if (window.tecnicoAtual) {
        jsonData = { ...jsonData, ...window.tecnicoAtual };
    }

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


let tecnicos = []; // para armazenar os dados completos

document.addEventListener("DOMContentLoaded", function () {
    const selectTecnico = document.getElementById("TecnicoResponsavel");

    if (!selectTecnico) return;
    if (!token) {
        console.error("Token não encontrado. Redirecionando para login.");
        window.location.href = "login.html";
        return;
    }

    // Faz GET na API de técnicos com token
    fetch(`${API_URL}/technicians`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar técnicos: " + response.status);
            return response.json();
        })
        .then(data => {
            tecnicos = data; // guarda os dados completos
            selectTecnico.innerHTML = '<option value="">Selecione</option>';

            data.forEach(tecnico => {
                const option = document.createElement("option");
                option.value = tecnico.id;
                option.textContent = tecnico.nomeTecnico; // mapeia corretamente
                selectTecnico.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar técnicos:", error);
            selectTecnico.innerHTML = '<option value="">Erro ao carregar técnicos</option>';
        });

    // --- Quando selecionar um técnico ---
    selectTecnico.addEventListener("change", function () {
        const selectedId = parseInt(this.value);
        const tecnicoSelecionado = tecnicos.find(t => t.id === selectedId);
        if (!tecnicoSelecionado) return;

        // Armazena globalmente os dados do técnico para JSON e formulário
        window.tecnicoAtual = {
            "#NomeTecnico": tecnicoSelecionado.nomeTecnico,           // ID: NomeTecnico
            "#TituloTecnico": tecnicoSelecionado.tituloTecnico,       // ID: TituloTecnico
            "#RegistroTecnico": tecnicoSelecionado.registroTecnico,   // ID: RegistroTecnico
            "#EmailTecnico": tecnicoSelecionado.emailTecnico,         // ID: EmailTecnico
            "#TelefoneTecnico": tecnicoSelecionado.telefoneFixoTecnico, // ID: TelefoneTecnico
            "#CelularTecnico": tecnicoSelecionado.celularTecnico,     // ID: CelularTecnico
            "#faxTecnico": tecnicoSelecionado.faxTecnico,             // ID: faxTecnico
            "#EnderecoTecnico": tecnicoSelecionado.enderecoTecnico,   // ID: EnderecoTecnico
            "#BairroTecnico": tecnicoSelecionado.bairroTecnico,       // ID: BairroTecnico
            "#MunicipioTecnico": tecnicoSelecionado.cidadeTecnico,    // ID: MunicipioTecnico
            "#UfTecnico": tecnicoSelecionado.ufTecnico,               // ID: UfTecnico
            "#UfTecnico2": tecnicoSelecionado.ufTecnicoEndereco || tecnicoSelecionado.ufTecnico, // ID: UfTecnico2
            "#CEPTecnico": tecnicoSelecionado.cepTecnico              // ID: CEPTecnico
        };

        console.log("Técnico selecionado para JSON:", window.tecnicoAtual);
    });
});

// Armazenar os templates carregados globalmente
let templatesCache = [];

async function populateTemplateDropdowns() {
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
        templatesCache = templates; // salvar no cache

        const selectModulo = document.getElementById("selectTemplateModulo");
        const selectInversor = document.getElementById("selectTemplateInversor");

        selectModulo.length = 1;
        selectInversor.length = 1;

        templates.forEach(t => {
            const option = document.createElement("option");
            option.value = t.id;
            option.textContent = t.name;

            if (t.type === "modulo") selectModulo.appendChild(option);
            else if (t.type === "inversor") selectInversor.appendChild(option);
        });

    } catch (err) {
        console.error("Erro ao popular dropdowns:", err);
    }
}

// Função para preencher os campos do módulo
function fillModuleFields(templateId) {
    const template = templatesCache.find(t => t.id == templateId && t.type === "modulo");
    if (!template) return;

    const data = template.data; // assumindo que os valores do módulo estão em template.data

    // Preenchendo os campos do formulário
    document.getElementById("templateModuloName").value = template.name || "";
    document.getElementById("VocModulo").value = data.Voc || "";
    //document.getElementById("CorrenteDisjuntor").value = data.CorrenteDisjuntor || "";
    document.getElementById("IscModulo").value = data.Isc || "";
    document.getElementById("VpmpModulo").value = data.Vpmp || "";
    document.getElementById("IpmpModulo").value = data.Ipmp || "";
    document.getElementById("EficienciaModulo").value = data.Eficiencia || "";
    document.getElementById("LarguraModulo").value = data.LarguraModulo || "";
    document.getElementById("AlturaModulo").value = data.AlturaModulo || "";
    document.getElementById("PesoModulo").value = data.PesoModulo || "";

    document.getElementById("PotenciaModulo1").value = data.PotenciaModulo1 || "";
    //document.getElementById("QuantidadeValor1").value = data.QuantidadeValor1 || "";
    document.getElementById("PotenciaValor1").value = data.PotenciaValor1 || "";
    //document.getElementById("AreaValor1").value = data.AreaValor1 || "";
    document.getElementById("FabricanteModulo1").value = data.FabricanteModulo1 || "";
    document.getElementById("ModeloModulo1").value = data.ModeloModulo1 || "";

    //document.getElementById("QtdModulo").value = data.quantidadeTotal || "";
    document.getElementById("PotenciaPico").value = data.potenciaPicoTotal || "";
    //document.getElementById("AreaModulo").value = data.areaArranjoTotal || "";

    document.getElementById("CapacidadeDeConducaoCC").value = data.CapacidadeDeConducaoCC || "";
    document.getElementById("CapacidadeDeConducaoCA").value = data.CapacidadeDeConducaoCA || "";
}

// Listener do dropdown do módulo
document.getElementById("selectTemplateModulo").addEventListener("change", (e) => {
    const templateId = e.target.value;
    if (!templateId) return; // Nenhum selecionado
    fillModuleFields(templateId);
});

// Chamar a função de popular dropdowns ao carregar a página
window.addEventListener("DOMContentLoaded", populateTemplateDropdowns);

// Listener do dropdown do inversor
document.getElementById("selectTemplateInversor").addEventListener("change", (e) => {
    const templateId = e.target.value;
    if (!templateId) return; // Nenhum selecionado
    fillInverterFields(templateId);
});

// Função para preencher os campos do inversor
function fillInverterFields(templateId) {
    const template = templatesCache.find(t => t.id == templateId && t.type === "inversor");
    if (!template) return;

    const data = template.data; // assumindo que os valores do inversor estão em template.data

    // Preencher campos principais
    document.getElementById("templateInversorName").value = template.name || "";
    document.getElementById("PmaxCCInversor").value = data.PmaxCC || "";
    document.getElementById("VccMaxInversor").value = data.VccMax || "";
    document.getElementById("IccMaxInversor").value = data.IccMax || "";
    document.getElementById("VpmpMPPTInversor").value = data.VpmpMPPT || "";
    document.getElementById("VccPartInversor").value = data.VccPart || "";
    document.getElementById("QtdEntradasMPPTInversor").value = data.QtdEntradasMPPT || "";
    document.getElementById("StringsMPPTInversor").value = data.StringsMPPT || "";
    document.getElementById("FrequenciaNominalInversor").value = data.FrequenciaNominal || "";
    document.getElementById("EficienciaMaximaInversor").value = data.EficienciaMaxima || "";

    // Preencher tabela de inversores (linha 1)
    document.getElementById("FabricanteInversor1").value = data.FabricanteInversor1 || "";
    document.getElementById("ModeloInversor1").value = data.ModeloInversor1 || "";
    document.getElementById("PotenciaValorInversor1").value = data.PotenciaValorInversor1 || "";
    document.getElementById("FaixaTensaoInversor1").value = data.FaixaTensaoInversor1 || "";
    document.getElementById("CorrenteNominalInversor1").value = data.CorrenteNominalInversor1 || "";
    document.getElementById("FPInversor1").value = data.FPInversor1 || "";
    document.getElementById("RendimentoInversor1").value = data.RendimentoInversor1 || "";
    document.getElementById("DHTInversor1").value = data.DHTInversor1 || "";

    // Total de potência do inversor
    document.getElementById("PotenciaInversorTotal").value = data.potenciaInversorTotal || "";
}

async function salvarTemplates() {
    const selectModulo = document.getElementById("selectTemplateModulo");
    const selectInversor = document.getElementById("selectTemplateInversor");

    const nomeModulo = document.getElementById("templateModuloName").value.trim();
    const nomeInversor = document.getElementById("templateInversorName").value.trim();

    // Não envia se houver template selecionado no dropdown
    const templateModuloSelecionado = selectModulo.value;
    const templateInversorSelecionado = selectInversor.value;

    if ((!nomeModulo || templateModuloSelecionado) && (!nomeInversor || templateInversorSelecionado)) {
        console.log("Templates preenchidos via dropdown. Não enviando para evitar duplicidade.");
        return;
    }

    let jsonData = {};

    // Preenche o JSON com todos os campos do formulário
    document.querySelectorAll("#orcamentoForm input, #orcamentoForm select").forEach(field => {
        if (!field.id) return;
        jsonData[field.name || field.id] = field.value;
    });

    // Adiciona os nomes dos templates somente se não tiver template selecionado
    if (nomeModulo && !templateModuloSelecionado) jsonData.templateModuloName = nomeModulo;
    if (nomeInversor && !templateInversorSelecionado) jsonData.templateInversorName = nomeInversor;

    try {
        const response = await fetch(`${API_URL}/render-with-template`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(jsonData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Erro ao salvar template:", result);
            alert("Erro ao salvar template: " + (result.detail || response.statusText));
        } else {
            console.log("Templates salvos:", result);
            alert("Templates salvos com sucesso!");
        }

    } catch (error) {
        console.error("Erro ao salvar template:", error);
        alert("Erro ao salvar template.");
    }
}

// Exemplo de uso no submit do formulário
document.getElementById("orcamentoForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Primeiro, tenta salvar templates (se houver campos preenchidos)
    await salvarTemplates();

    // Depois, continua com o envio normal do formulário (ex.: gerar arquivo ou apenas processar JSON)
    const form = event.target;
    let jsonData = {};
    form.querySelectorAll("input, select").forEach(field => {
        if (!field.id) return;
        const key = "#" + field.id;
        jsonData[key] = field.value;
    });

    jsonData = enriquecerJson(jsonData);

    console.log("JSON final a enviar:", jsonData);

    // Aqui você pode colocar o fetch que gera o arquivo ou outro processamento
});
