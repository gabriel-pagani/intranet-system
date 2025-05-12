/**
 * Configuração e inicialização da aplicação de dashboards
 */
const DashboardApp = {
  // Configurações
  config: {
    storageKey: "sidebarCollapsed",
    reloadInterval: 3600000, // 60 minutos
  },

  // Estado da aplicação
  state: {
    sidebarCollapsed: false,
  },

  // Elementos DOM
  elements: {
    sidebar: null,
    sidebarToggle: null,
    dashboardView: null,
    toggleIcon: null,
    dashboardButtons: null,
    sectionToggles: null,
    iframe: null,
    sectionPanels: null,
  },

  /**
   * Inicializa a aplicação
   */
  init: function () {
    // Captura elementos
    this.elements.sidebar = document.getElementById("sidebar");
    this.elements.dashboardView = document.getElementById("dashboard-view");
    this.elements.sidebarToggle = document.getElementById("toggle-sidebar");
    this.elements.toggleIcon = this.elements.sidebarToggle.querySelector("i");
    this.elements.dashboardButtons =
      document.querySelectorAll(".dashboard-btn");
    this.elements.sectionToggles = document.querySelectorAll(".section-toggle");
    this.elements.iframe = document.getElementById("dashboard-frame");
    this.elements.sectionPanels = document.querySelectorAll(".section-panel");

    // Carrega configurações salvas
    this.loadSavedState();

    // Configura eventos
    this.setupEventListeners();

    // Inicializa painéis como fechados
    this.initializePanels();

    // Configura recarga automática
    this.setupAutoReload();

    // Configura responsividade
    this.setupResponsiveness();
  },

  /**
   * Carrega estado salvo do localStorage
   */
  loadSavedState: function () {
    this.state.sidebarCollapsed =
      localStorage.getItem(this.config.storageKey) === "true";

    if (this.state.sidebarCollapsed) {
      this.elements.sidebar.classList.add("collapsed");
      this.elements.dashboardView.classList.add("expanded");
      this.elements.sidebarToggle.classList.add("collapsed");
      this.elements.toggleIcon.classList.remove("bi-chevron-left");
      this.elements.toggleIcon.classList.add("bi-chevron-right");
    }
  },

  /**
   * Configura escutadores de eventos
   */
  setupEventListeners: function () {
    // Botões de dashboard
    this.elements.dashboardButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.handleDashboardClick(btn));
    });

    // Toggles de seção
    this.elements.sectionToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => this.handleSectionToggle(toggle));
    });

    // Toggle da sidebar
    this.elements.sidebarToggle.addEventListener("click", () =>
      this.toggleSidebar()
    );
  },

  /**
   * Inicializa painéis como fechados
   */
  initializePanels: function () {
    // Esconde todos os painéis
    this.elements.sectionPanels.forEach((panel) => {
      panel.style.display = "none";
    });

    // Atualiza ícones
    document.querySelectorAll(".section-toggle i").forEach((icon) => {
      icon.classList.remove("bi-chevron-down");
      icon.classList.add("bi-chevron-right");
    });
  },

  /**
   * Configura recarregamento automático
   */
  setupAutoReload: function () {
    setInterval(() => location.reload(), this.config.reloadInterval);
  },

  /**
   * Configura comportamento responsivo
   */
  setupResponsiveness: function () {
    const debounce = (func, wait) => {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    };

    window.addEventListener(
      "resize",
      debounce(() => {
        if (
          window.innerWidth < 768 &&
          !this.elements.sidebar.classList.contains("collapsed")
        ) {
          this.toggleSidebar();
        }
      }, 250)
    );
  },

  /**
   * Alterna o estado da sidebar
   */
  toggleSidebar: function () {
    this.elements.sidebar.classList.toggle("collapsed");
    this.elements.dashboardView.classList.toggle("expanded");
    this.elements.sidebarToggle.classList.toggle("collapsed");

    const isCollapsed = this.elements.sidebar.classList.contains("collapsed");
    this.state.sidebarCollapsed = isCollapsed;

    // Atualiza ícone
    if (isCollapsed) {
      this.elements.toggleIcon.classList.remove("bi-chevron-left");
      this.elements.toggleIcon.classList.add("bi-chevron-right");
    } else {
      this.elements.toggleIcon.classList.remove("bi-chevron-right");
      this.elements.toggleIcon.classList.add("bi-chevron-left");
    }

    // Salva preferência
    localStorage.setItem(this.config.storageKey, isCollapsed);
  },

  /**
   * Manipula clique em um botão de dashboard
   */
  handleDashboardClick: function (button) {
    // Atualiza iframe
    this.elements.iframe.src = button.getAttribute("data-url");

    // Destaca botão ativo
    this.elements.dashboardButtons.forEach(
      (btn) => (btn.style.backgroundColor = "")
    );
    button.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
  },

  /**
   * Manipula ativação/desativação de seções
   */
  handleSectionToggle: function (toggle) {
    const targetId = toggle.getAttribute("data-target");
    const panel = document.getElementById(targetId);
    const icon = toggle.querySelector("i");

    if (panel.style.display === "none") {
      panel.style.display = "block";
      icon.classList.remove("bi-chevron-right");
      icon.classList.add("bi-chevron-down");
    } else {
      panel.style.display = "none";
      icon.classList.remove("bi-chevron-down");
      icon.classList.add("bi-chevron-right");
    }
  },
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  DashboardApp.init();
});
