document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggle");
    
    // Restaurar estado da sidebar do localStorage
    const sidebarState = localStorage.getItem('home-sidebar-collapsed');
    if (sidebarState === 'true') {
        sidebar.classList.add("collapsed");
    }
    
    // Toggle da sidebar com cache
    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        
        // Salvar estado no localStorage
        const isCollapsed = sidebar.classList.contains("collapsed");
        localStorage.setItem('home-sidebar-collapsed', isCollapsed);
    });
});