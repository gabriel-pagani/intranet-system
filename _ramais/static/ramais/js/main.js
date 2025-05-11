const itemsPerPage = 10;
let currentPage = 1;
let ramaisList = [];
let filteredRamais = [];

// Load ramais for current page
function loadRamais(list = filteredRamais) {
    const tableBody = document.querySelector('#extensions-table tbody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = list.slice(start, end);

    pageItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.ramal}</td>
            <td>${item.setor}</td>
            <td>${item.maquina}</td>
        `;
        tableBody.appendChild(row);
    });
    
    renderPagination(list.length);
}

// Create pagination buttons
function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');
        
        if (i === currentPage) {
            pageBtn.classList.add('active-page');
        }

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            loadRamais();
        });

        paginationContainer.appendChild(pageBtn);
    }
}

// Filter extensions based on search term
function filterRamais() {
    const input = document.getElementById('search').value.trim().toLowerCase();
    const isInverseSearch = input.startsWith('-');
    
    const searchTerm = isInverseSearch 
        ? removeAccents(input.slice(1).trim()) 
        : removeAccents(input);

    filteredRamais = ramaisList.filter(item => {
        const name = removeAccents(item.nome.toLowerCase());
        const ext = removeAccents(item.ramal.toLowerCase());
        const sector = removeAccents(item.setor.toLowerCase());
        const machine = removeAccents(item.maquina.toLowerCase());

        const containsTerm = name.includes(searchTerm) || 
                           ext.includes(searchTerm) || 
                           sector.includes(searchTerm) || 
                           machine.includes(searchTerm);

        return isInverseSearch ? !containsTerm : containsTerm;
    });

    currentPage = 1;
    loadRamais();
}

// Remove accents for better search
function removeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Load data when page loads
document.addEventListener("DOMContentLoaded", function() {
    fetch("/ramais/api/")
        .then(response => response.json())
        .then(data => {
            ramaisList = data;
            filteredRamais = [...ramaisList];
            loadRamais();
        })
        .catch(error => console.error("Erro ao carregar os ramais:", error));
});
