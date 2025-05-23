const ramaisPorPagina = 10; // Número de ramais por página
let paginaAtual = 1; // Página inicial


// Função para carregar os ramais da página atual
function carregarRamais(lista = ramaisFiltrados) {
    const listaElement = document.querySelector('#lista-ramais tbody');
    listaElement.innerHTML = '';

    const inicio = (paginaAtual - 1) * ramaisPorPagina;
    const fim = inicio + ramaisPorPagina;
    const ramaisPagina = lista.slice(inicio, fim);

    ramaisPagina.forEach((ramal) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ramal.nome}</td>
            <td>${ramal.ramal}</td>
            <td>${ramal.setor}</td>
            <td>${ramal.maquina}</td>
        `;
        listaElement.appendChild(row);
    });
    renderizarPaginacao(lista.length);
}

// Função para criar botões de navegação de páginas
function renderizarPaginacao(totalRamais) {
    const paginacaoContainer = document.getElementById('paginacao');
    paginacaoContainer.innerHTML = '';

    const totalPaginas = Math.ceil(totalRamais / ramaisPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
        const botaoPagina = document.createElement('button');
        botaoPagina.textContent = i;
        botaoPagina.classList.add('pagina-botao');
        if (i === paginaAtual) botaoPagina.classList.add('pagina-ativa');

        botaoPagina.addEventListener('click', () => {
            paginaAtual = i;
            carregarRamais();
        });

        paginacaoContainer.appendChild(botaoPagina);
    }
}

// Função para filtrar os ramais com base no termo de pesquisa
function filtrarRamais() {
    const input = document.getElementById('search-input').value.toLowerCase().trim();
    const buscaInversa = input.startsWith('-');

    const termo = buscaInversa
        ? removerAcentos(input.slice(1).trim())
        : removerAcentos(input);

    ramaisFiltrados = listaRamais.filter((ramal) => {
        const nome = removerAcentos(ramal.nome.toLowerCase());
        const ramalNumero = removerAcentos(ramal.ramal.toLowerCase());
        const setor = removerAcentos(ramal.setor.toLowerCase());
        const maquina = removerAcentos(ramal.maquina.toLowerCase());

        const contemTermo =
            nome.includes(termo) ||
            ramalNumero.includes(termo) ||
            setor.includes(termo) ||
            maquina.includes(termo);

        return buscaInversa ? !contemTermo : contemTermo;
    });

    paginaAtual = 1; // Resetar para a primeira página após filtrar
    carregarRamais();
}

// Função para remover acentos (ajuda na pesquisa)
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener("DOMContentLoaded", function () {
    // Carrega os ramais a partir do arquivo JSON
    fetch("/ramais/api/")
      .then(response => response.json())
      .then(data => {
        listaRamais = data;
        ramaisFiltrados = [...listaRamais];
        carregarRamais();
      })
      .catch(error => console.error("Erro ao carregar os ramais:", error));
});
