const form = document.getElementById("form-signo");
const inputData = document.getElementById("data-nascimento");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dataNascimento = inputData.value;

    if (!dataNascimento) {
        resultado.innerHTML = `
            <h2>Resultado</h2>
            <p>Por favor, informe uma data de nascimento.</p>
        `;
        return;
    }

    const partesData = dataNascimento.split("-");
    const mes = partesData[1];
    const dia = partesData[2];
    const dataFormatada = `${mes}-${dia}`;

    try {
        const resposta = await fetch("data/signos.xml");
        const textoXML = await resposta.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(textoXML, "application/xml");

        const signos = xml.getElementsByTagName("signo");

        let signoEncontrado = null;

        for (let i = 0; i < signos.length; i++) {
            const nome = signos[i].getElementsByTagName("nome")[0].textContent;
            const inicio = signos[i].getElementsByTagName("inicio")[0].textContent;
            const fim = signos[i].getElementsByTagName("fim")[0].textContent;
            const descricao = signos[i].getElementsByTagName("descricao")[0].textContent;

            if (
                (inicio <= fim && dataFormatada >= inicio && dataFormatada <= fim) ||
                (inicio > fim && (dataFormatada >= inicio || dataFormatada <= fim))
            ) {
                signoEncontrado = { nome, descricao };
                break;
            }
        }

        if (signoEncontrado) {
            resultado.innerHTML = `
                <h2>Resultado</h2>
                <p>Seu signo é <strong>${signoEncontrado.nome}</strong>.</p>
                <p>${signoEncontrado.descricao}</p>
            `;
        } else {
            resultado.innerHTML = `
                <h2>Resultado</h2>
                <p>Não foi possível identificar o signo.</p>
            `;
        }
    } catch (erro) {
        resultado.innerHTML = `
            <h2>Resultado</h2>
            <p>Erro ao carregar o arquivo XML.</p>
        `;
        console.error("Erro ao ler o XML:", erro);
    }
});