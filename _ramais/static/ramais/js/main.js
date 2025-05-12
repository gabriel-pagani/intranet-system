/**
 * Configuração e inicialização da aplicação de ramais
 */
const RamaisApp = {
    // Configurações
    config: {
        itemsPerPage: 10,
        apiUrl: "/ramais/api/"
    },

    // Estado da aplicação
    state: {
        currentPage: 1,
        ramaisList: [],
        filteredRamais: []
    },

    // Elementos DOM
    elements: {
        table: null,
        tableBody: null,
        searchInput: null,
        pagination: null
    },

    /**
     * Inicializa a aplicação
     */
    init: function() {
        // Captura elementos
        this.elements.table = document.getElementById('extensions-table');
        this.elements.tableBody = this.elements.table.querySelector('tbody');
        this.elements.searchInput = document.getElementById('search');
        this.elements.pagination = document.getElementById('pagination');

        // Configura eventos
        this.elements.searchInput.addEventListener('input', this.handleSearch.bind(this));

        // Carrega dados
        this.loadData();
    },

    /**
     * Carrega dados da API
     */
    loadData: function() {
        fetch(this.config.apiUrl)
            .then(response => response.json())
            .then(data => {
                this.state.ramaisList = data;
                this.state.filteredRamais = [...data];
                this.renderRamais();
            })
            .catch(error => console.error("Erro ao carregar os ramais:", error));
    },

    /**
     * Renderiza a tabela de ramais
     */
    renderRamais: function() {
        const { currentPage } = this.state;
        const { itemsPerPage } = this.config;
        const ramais = this.state.filteredRamais;
        
        // Limpa tabela
        this.elements.tableBody.innerHTML = '';

        // Calcula índices para paginação
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = ramais.slice(start, end);

        // Adiciona ramais à tabela
        if (pageItems.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4" class="text-center">Nenhum ramal encontrado.</td>`;
            this.elements.tableBody.appendChild(emptyRow);
        } else {
            pageItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.ramal}</td>
                    <td>${item.setor}</td>
                    <td>${item.maquina}</td>
                `;
                this.elements.tableBody.appendChild(row);
            });
        }
        
        // Renderiza paginação
        this.renderPagination();
    },

    /**
     * Renderiza componente de paginação
     */
    renderPagination: function() {
        const { currentPage } = this.state;
        const { itemsPerPage } = this.config;
        const totalItems = this.state.filteredRamais.length;
        
        // Limpa paginação
        this.elements.pagination.innerHTML = '';

        // Se não houver itens, não renderiza paginação
        if (totalItems === 0) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Adiciona botões de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.add('page-btn');
            
            if (i === currentPage) {
                pageBtn.classList.add('active-page');
            }

            pageBtn.addEventListener('click', () => this.goToPage(i));
            
            this.elements.pagination.appendChild(pageBtn);
        }
    },

    /**
     * Navega para a página especificada
     */
    goToPage: function(page) {
        this.state.currentPage = page;
        this.renderRamais();
    },

    /**
     * Manipula pesquisa
     */
    handleSearch: function() {
        const input = this.elements.searchInput.value.trim().toLowerCase();
        const isInverseSearch = input.startsWith('-');
        
        const searchTerm = isInverseSearch 
            ? this.removeAccents(input.slice(1).trim()) 
            : this.removeAccents(input);

        this.state.filteredRamais = this.state.ramaisList.filter(item => {
            const name = this.removeAccents(item.nome.toLowerCase());
            const ext = this.removeAccents(item.ramal.toLowerCase());
            const sector = this.removeAccents(item.setor.toLowerCase());
            const machine = this.removeAccents(item.maquina.toLowerCase());

            const containsTerm = name.includes(searchTerm) || 
                               ext.includes(searchTerm) || 
                               sector.includes(searchTerm) || 
                               machine.includes(searchTerm);

            return isInverseSearch ? !containsTerm : containsTerm;
        });

        this.state.currentPage = 1;
        this.renderRamais();
    },

    /**
     * Remove acentos para melhorar a pesquisa
     */
    removeAccents: function(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    RamaisApp.init();
});
