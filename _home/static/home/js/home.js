document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggle");
    const userToggle = document.getElementById("user-toggle");
    const userDropdown = document.getElementById("user-dropdown");
    
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
        
        // Fechar dropdown se estiver aberto
        if (userDropdown.classList.contains('show')) {
            closeUserDropdown();
        }
    });
    
    // Toggle do menu do usuário
    userToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = userDropdown.classList.contains('show');
        
        if (isOpen) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    });
    
    // Função para abrir dropdown
    function openUserDropdown() {
        userDropdown.classList.add('show');
        userToggle.classList.add('active');
    }
    
    // Função para fechar dropdown
    function closeUserDropdown() {
        userDropdown.classList.remove('show');
        userToggle.classList.remove('active');
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
            closeUserDropdown();
        }
    });
    
    // Fechar dropdown ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeUserDropdown();
        }
    });
});