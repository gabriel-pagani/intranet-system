document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggle");
    const logoImg = document.getElementById("logo-img");
    
    // Função para atualizar o logo
    function updateLogo() {
        const isCollapsed = sidebar.classList.contains("collapsed");
        if (isCollapsed) {
            logoImg.src = logoImg.dataset.iconLogo;
        } else {
            logoImg.src = logoImg.dataset.fullLogo;
        }
    }
    
    // Restaurar estado da sidebar do localStorage
    const sidebarState = localStorage.getItem('home-sidebar-collapsed');
    if (sidebarState === 'true') {
        sidebar.classList.add("collapsed");
    }
    updateLogo(); // Atualiza o logo no carregamento da página
    
    // Toggle da sidebar com cache
    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        updateLogo(); // Atualiza o logo ao clicar no botão
        
        // Salvar estado no localStorage
        const isCollapsed = sidebar.classList.contains("collapsed");
        localStorage.setItem('home-sidebar-collapsed', isCollapsed);
    });
});