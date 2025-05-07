document.addEventListener('DOMContentLoaded', function() {
    // Gerenciamento dos dashboards no iframe
    const buttons = document.querySelectorAll('.dash-link');
    const iframe = document.getElementById('dashboardFrame');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            iframe.src = btn.getAttribute('data-url');
        });
    });

    // Recolher/expandir setores na navegação
    const setorToggles = document.querySelectorAll('.setor-toggle');
    
    // Inicializa todos os painéis como ocultos
    document.querySelectorAll('.setor-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Atualiza os ícones para mostrar que estão minimizados
    document.querySelectorAll('.setor-toggle i').forEach(icon => {
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-right');
    });
    
    setorToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            const icon = toggle.querySelector('i');

            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                icon.classList.remove('bi-chevron-right');
                icon.classList.add('bi-chevron-down');
            } else {
                panel.style.display = 'none';
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-right');
            }
        });
    });

    // Funcionalidade para ocultar/mostrar a sidebar
    const sidebar = document.getElementById('sidebar');
    const dashboardView = document.getElementById('dashboardView');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const toggleIcon = sidebarToggle.querySelector('i');

    // Verifica se há preferência salva no localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Aplica estado inicial baseado na preferência salva
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        dashboardView.classList.add('expanded');
        sidebarToggle.classList.add('collapsed');
        toggleIcon.classList.remove('bi-chevron-left');
        toggleIcon.classList.add('bi-chevron-right');
    }

    // Toggle da sidebar
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        dashboardView.classList.toggle('expanded');
        sidebarToggle.classList.toggle('collapsed');
        
        // Troca o ícone de direção
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.remove('bi-chevron-left');
            toggleIcon.classList.add('bi-chevron-right');
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            toggleIcon.classList.remove('bi-chevron-right');
            toggleIcon.classList.add('bi-chevron-left');
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    });

    // Recarregar a página a cada 60 minutos
    setInterval(() => location.reload(), (1000 * 60 * 60));
});