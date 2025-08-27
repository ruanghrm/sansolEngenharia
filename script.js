document.getElementById("orcamentoForm").addEventListener("submit", function (event) {
    event.preventDefault(); // evita envio tradicional

    const form = event.target;
    let jsonData = {};

    // percorre inputs e selects
    form.querySelectorAll("input, select").forEach(field => {
        if (!field.id) return; // ignora campos sem ID
        const key = "#" + field.id; // adiciona o # no começo
        jsonData[key] = field.value;
    });

    // 🔹 Enriquecer o JSON com novos campos
    jsonData = enriquecerJson(jsonData);

    console.log("JSON a enviar:", jsonData);

    // envia os dados para o backend e faz download
    fetch("http://69.62.91.145:7899/render?type=both", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao gerar arquivo");

            // tenta capturar o nome do arquivo do header
            const disposition = response.headers.get("Content-Disposition");
            let filename = "arquivo_gerado.zip"; // default
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

function enriquecerJson(jsonData) {
    // Regra para PolosDisjuntor baseado em TipoLigacao
    if (jsonData["#TipoLigacao"] === "BIFÁSICO") {
        jsonData["#PolosDisjuntor"] = "2P";
    } else if (jsonData["#TipoLigacao"] === "TRIFÁSICO") {
        jsonData["#PolosDisjuntor"] = "3P";
    }

    // 🔹 Regras de combinação PolosDisjuntor + DisjuntorEntrada → TipoCabo / SecaoCabo
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

    // Monta a chave de busca ex: "2P-63 A"
    const chave = `${jsonData["#PolosDisjuntor"] || ""}-${jsonData["#DisjuntorEntrada"] || ""}`;

    if (regrasCabos[chave]) {
        jsonData["#TipoCabo"] = regrasCabos[chave].tipo;
        jsonData["#SecaoCabo"] = regrasCabos[chave].secao;
    }

    // 🔹 Campos fixos
    jsonData["#Termomagnetico"] = "TERMOMAGNÉTICO";
    jsonData["#FrequenciaNominal"] = "60";
    jsonData["#CapacidadeMaxInterrupcao"] = "10";
    jsonData["#CurvaAtuacao"] = "C";
    jsonData["#FPDado"] = "0,92";
    jsonData["#CapacidadeMaxAtuacao"] = "3";

    // 🔹 Campo condicional NFdado e CapacidadeDeConducao
    if (jsonData["#TipoLigacao"] === "MONOFÁSICO" || jsonData["#TipoLigacao"] === "BIFÁSICO") {
        jsonData["#NFdado"] = "1";
    } else if (jsonData["#TipoLigacao"] === "TRIFÁSICO") {
        jsonData["#NFdado"] = "√3";
    }

    if (jsonData["#SecaoCondutorCC"] === "4 mm²") {
        jsonData["#CapacidadeDeConducaoCC"] = "41 A";
    } else if (jsonData["#SecaoCondutorCC"] === "6 mm²") {
        jsonData["#CapacidadeDeConducaoCC"] = "57 A";
    }


    if (jsonData["#SecaoCondutorCA"] === "4 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "42 A";
    } else if (jsonData["#SecaoCondutorCA"] === "6 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "54 A";
    } else if (jsonData["#SecaoCondutorCA"] === "10 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "75 A";
    } else if (jsonData["#SecaoCondutorCA"] === "16 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "100 A";
    } else if (jsonData["#SecaoCondutorCA"] === "25 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "133 A";
    } else if (jsonData["#SecaoCondutorCA"] === "35 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "164 A";
    } else if (jsonData["#SecaoCondutorCA"] === "50 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "198 A";
    } else if (jsonData["#SecaoCondutorCA"] === "70 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "253 A";
    } else if (jsonData["#SecaoCondutorCA"] === "95 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "306 A";
    } else if (jsonData["#SecaoCondutorCA"] === "120 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "354 A";
    } else if (jsonData["#SecaoCondutorCA"] === "150 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "407 A";
    } else if (jsonData["#SecaoCondutorCA"] === "185 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "464 A";
    } else if (jsonData["#SecaoCondutorCA"] === "240 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "546 A";
    } else if (jsonData["#SecaoCondutorCA"] === "300 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "528 A";
    } else if (jsonData["#SecaoCondutorCA"] === "400 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "751 A";
    } else if (jsonData["#SecaoCondutorCA"] === "500 mm²") {
        jsonData["#CapacidadeDeConducaoCA"] = "864 A";
    }

    // 🔹 Cálculo do PDkva = PotenciaDisponibilizada / FPDado
    const potencia = parseFloat(jsonData["#PotenciaDisponibilizada"]) || 0;
    const fp = parseFloat(jsonData["#FPDado"].replace(",", ".")) || 0;

    if (fp > 0 && potencia > 0) {
        jsonData["#PDkva"] = (potencia / fp).toFixed(2);
    } else {
        jsonData["#PDkva"] = "";
    }

    // 🔹 Cálculo do #GeracaoMedia = #PotenciaPico * 110
    const potenciaPico = parseFloat(jsonData["#PotenciaPico"]) || 0;
    jsonData["#GeracaoMedia"] = (potenciaPico * 110).toFixed(2);

    return jsonData;
}
