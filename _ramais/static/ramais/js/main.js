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
            <td>
                <div class="machine-cell">
                    <span>${ramal.maquina}</span>
                    <button class="copy-btn" onclick="copiarTexto('${ramal.maquina}')" title="Copiar número da máquina">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </td>
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
    
    // Não mostrar paginação se houver apenas uma página
    if (totalPaginas <= 1) return;
    
    // Lógica para mostrar páginas com reticências em telas pequenas
    const isMobile = window.innerWidth <= 480;
    const maxVisiblePages = isMobile ? 3 : 7;
    
    let startPage = Math.max(1, paginaAtual - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPaginas, startPage + maxVisiblePages - 1);
    
    // Ajustar início se estivermos próximos ao final
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Botão "Anterior"
    if (paginaAtual > 1) {
        const botaoAnterior = document.createElement('button');
        botaoAnterior.innerHTML = isMobile ? '‹' : '‹ Anterior';
        botaoAnterior.classList.add('pagina-botao');
        botaoAnterior.addEventListener('click', () => {
            paginaAtual--;
            carregarRamais();
        });
        paginacaoContainer.appendChild(botaoAnterior);
    }
    
    // Primeira página e reticências
    if (startPage > 1) {
        const primeira = document.createElement('button');
        primeira.textContent = '1';
        primeira.classList.add('pagina-botao');
        primeira.addEventListener('click', () => {
            paginaAtual = 1;
            carregarRamais();
        });
        paginacaoContainer.appendChild(primeira);
        
        if (startPage > 2) {
            const reticencias = document.createElement('span');
            reticencias.textContent = '...';
            reticencias.style.padding = '8px 4px';
            reticencias.style.color = '#666';
            paginacaoContainer.appendChild(reticencias);
        }
    }
    
    // Páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
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
    
    // Reticências e última página
    if (endPage < totalPaginas) {
        if (endPage < totalPaginas - 1) {
            const reticencias = document.createElement('span');
            reticencias.textContent = '...';
            reticencias.style.padding = '8px 4px';
            reticencias.style.color = '#666';
            paginacaoContainer.appendChild(reticencias);
        }
        
        const ultima = document.createElement('button');
        ultima.textContent = totalPaginas;
        ultima.classList.add('pagina-botao');
        ultima.addEventListener('click', () => {
            paginaAtual = totalPaginas;
            carregarRamais();
        });
        paginacaoContainer.appendChild(ultima);
    }
    
    // Botão "Próximo"
    if (paginaAtual < totalPaginas) {
        const botaoProximo = document.createElement('button');
        botaoProximo.innerHTML = isMobile ? '›' : 'Próximo ›';
        botaoProximo.classList.add('pagina-botao');
        botaoProximo.addEventListener('click', () => {
            paginaAtual++;
            carregarRamais();
        });
        paginacaoContainer.appendChild(botaoProximo);
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

// Função para copiar texto para a área de transferência
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
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
