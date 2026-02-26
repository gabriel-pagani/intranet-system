/* _dashboards/static/dashboards/js/main.js */

document.addEventListener("DOMContentLoaded", function () {
    const menuList = document.querySelector('.menu-list');
    const sidebar = document.getElementById("sidebar"); // Referência para verificar se está colapsado
    
    if (!menuList) return;

    // Correção: Sincronizar estados ao alternar a sidebar
    const toggleBtn = document.getElementById("toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function() {
            // Este evento roda ANTES do sidebar.js alternar a classe 'collapsed'
            const isCurrentlyCollapsed = sidebar.classList.contains("collapsed");

            if (isCurrentlyCollapsed) {
                // Expandindo: Converter Dropdowns (.show) para Acordeões (.active)
                document.querySelectorAll('.submenu.show').forEach(submenu => {
                    submenu.classList.remove('show');
                    submenu.classList.add('active');
                    // Limpar estilos inline de posicionamento do dropdown
                    submenu.style.maxHeight = '';
                    submenu.style.top = '';
                });
            } else {
                // Colapsando: Fechar Acordeões (.active) para evitar dropdowns flutuando
                document.querySelectorAll('.submenu.active').forEach(submenu => {
                    submenu.classList.remove('active');
                    const header = submenu.previousElementSibling;
                    if (header) header.classList.remove('active');
                });
            }
        });
    }

    const dashboardFrame = document.getElementById("dashboard-frame");
    const dashboardPlaceholder = document.getElementById("dashboard-placeholder");

    // Lógica principal de cliques (Adaptada do Vyzion)
    menuList.addEventListener('click', function(e) {
        const pinIcon = e.target.closest('.pin-icon');
        const dashboardLink = e.target.closest('.dashboard-link');
        const sectorHeader = e.target.closest('.sector-header');

        // 1. Favoritar
        if (pinIcon) {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(pinIcon);
            return;
        }

        // 2. Abrir Dashboard
        if (dashboardLink) {
            e.preventDefault();
            
            document.querySelectorAll(".dashboard-link").forEach((l) => l.classList.remove("active"));
            dashboardLink.classList.add("active");

            const dashboardUrl = dashboardLink.getAttribute("data-url");
            dashboardPlaceholder.style.display = "none";
            dashboardFrame.style.display = "block";
            dashboardFrame.src = dashboardUrl;
            
            // Salvar o dashboard selecionado no localStorage
            const dashboardId = dashboardLink.closest('li').getAttribute('data-id');
            if (dashboardId) {
                localStorage.setItem('lastSelectedDashboard', dashboardId);
            }

            // Se estiver colapsado, fecha o menu após clicar (comportamento Vyzion)
            if (sidebar.classList.contains("collapsed")) {
                closeAllSubmenus();
            }
            return;
        }

        // 3. Expandir/Recolher Setor (Lógica Híbrida Vyzion)
        if (sectorHeader) {
            const submenu = sectorHeader.nextElementSibling;
            if (!submenu || !submenu.classList.contains('submenu')) return;

            const isCollapsed = sidebar.classList.contains("collapsed");

            if (isCollapsed) {
                // MODO DROPDOWN (Vyzion: openDropdownSector)
                // Se já estiver aberto, fecha. Se não, abre este e fecha os outros.
                const isAlreadyOpen = submenu.classList.contains("show");
                
                closeAllSubmenus(); // Fecha tudo primeiro (regra do Vyzion p/ dropdown)

                if (!isAlreadyOpen) {
                    sectorHeader.classList.add("active");
                    submenu.classList.add("show");

                    // Lógica para reposicionar se estourar a tela
                    const rect = submenu.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // Altura máxima fixa para scrolagem interna
                    const maxHeight = windowHeight * 0.8; // 80% da tela
                    submenu.style.maxHeight = `${maxHeight}px`;

                    // Verifica se o dropdown ultrapassa o limite inferior da tela
                    if (rect.bottom > windowHeight) {
                        // Calcula a posição para abrir para cima
                        // O 'rect.top' é a posição atual do topo do elemento em relação à viewport.
                        // O 'rect.height' é a altura do elemento (já considerando o max-height aplicado pelo CSS ou JS se repintou, mas aqui aplicamos style logo acima).
                        // Corrigindo: Precisamos forçar o navegador a recalcular o layout ou usar a altura setada.
                        
                        // Vamos mover o `top` para que o fundo do menu fique alinhado com o fundo da janela menos uma margem
                        const overflow = rect.bottom - windowHeight + 20; // 20px de margem
                        const newTop = parseInt(window.getComputedStyle(submenu).top || 0) - overflow;
                        
                        submenu.style.top = `${newTop}px`;
                    }
                }

            } else {
                // MODO ACORDEÃO (Vyzion: activeSubmenus)
                sectorHeader.classList.toggle("active");
                submenu.classList.toggle("active");
            }
        }
    });

    // Fecha dropdowns ao clicar fora (Lógica Vyzion: useEffect handleClickOutside)
    document.addEventListener("click", function(event) {
        if (sidebar.classList.contains("collapsed")) {
            // Se o clique não foi dentro da lista do menu
            if (!event.target.closest(".menu-list")) {
                closeAllSubmenus();
            }
        }
    });

    // Função auxiliar para limpar estados
    function closeAllSubmenus() {
        // Remove 'active' dos cabeçalhos e 'show'/'active' dos submenus
        document.querySelectorAll(".sector-header.active").forEach(el => el.classList.remove("active"));
        document.querySelectorAll(".submenu.show").forEach(el => {
            el.classList.remove("show");
            el.style.maxHeight = ""; // Limpa estilo inline de altura
            el.style.top = "";       // Limpa estilo inline de posição
        });
        // Remove 'active' de submenus se estiverem abertos no modo acordeão e mudarmos para colapsado
        document.querySelectorAll(".submenu.active").forEach(el => el.classList.remove("active"));
    }

    // Restaurar o último dashboard selecionado ao carregar a página
    const lastSelectedDashboardId = localStorage.getItem('lastSelectedDashboard');
    if (lastSelectedDashboardId) {
        const targetLink = document.querySelector(`li[data-id="${lastSelectedDashboardId}"] .dashboard-link`);
        if (targetLink) {
            // Simula o clique para carregar o iframe
            targetLink.click();
            
            // Expande o menu pai se a sidebar não estiver colapsada
            const submenu = targetLink.closest('.submenu');
            if (submenu && !sidebar.classList.contains("collapsed")) {
                submenu.classList.add('active');
                const header = submenu.previousElementSibling;
                if (header && header.classList.contains('sector-header')) {
                    header.classList.add('active');
                }
            }
        }
    }
});

// --- O RESTANTE DO CÓDIGO (Busca, Favoritos, etc.) CONTINUA IGUAL ABAIXO ---

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-indicadores');
  const menuList = document.querySelector('.menu-list');
  const clearBtn = document.querySelector('.clear-search');
  let previousExpanded = [];

  if (!searchInput || !menuList) return;

  // Define visibilidade inicial do botão
  if (clearBtn) {
    clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', function() {
    if (clearBtn) {
      clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
    }

    const termo = searchInput.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (previousExpanded.length === 0 && termo) {
      previousExpanded = Array.from(menuList.querySelectorAll('.sector-header')).map(header =>
        header.classList.contains('active')
      );
    }

    menuList.querySelectorAll('li[data-id]').forEach(function(li) {
      const titulo = li.querySelector('.text')?.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      li.style.display = (!termo || (titulo && titulo.includes(termo))) ? '' : 'none';
    });

    menuList.querySelectorAll('.menu-item').forEach(function(section, idx) {
      const visible = Array.from(section.querySelectorAll('li[data-id]')).some(li => li.style.display !== 'none');
      section.style.display = visible ? '' : 'none';

      const header = section.querySelector('.sector-header');
      const submenu = section.querySelector('.submenu');
      if (termo && visible) {
        header.classList.add('active');
        submenu.classList.add('active');
      } else if (!termo && previousExpanded.length) {
        if (previousExpanded[idx]) {
          header.classList.add('active');
          submenu.classList.add('active');
        } else {
          header.classList.remove('active');
          submenu.classList.remove('active');
        }
      }
    });

    if (!termo) previousExpanded = [];
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    });
  }
});

function toggleFavorite(pinIcon) {
    const dashboardId = pinIcon.dataset.id;
    const url = `/indicadores/api/toggle-favorite/${dashboardId}/`;

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.querySelectorAll(`.pin-icon[data-id="${dashboardId}"]`).forEach(icon => {
                icon.classList.toggle('favorited', data.is_favorite);
                icon.title = data.is_favorite ? 'Desafixar dos favoritos' : 'Fixar nos favoritos';
            });
            updateFavoritesList(dashboardId, data.is_favorite);
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateFavoritesList(dashboardId, isFavorite) {
    let favoritesList = document.getElementById('favorites-list');
    const menuList = document.querySelector('.menu-list');
    const originalItem = document.querySelector(`.submenu:not(#favorites-list) li[data-id="${dashboardId}"]`);

    if (isFavorite) {
        if (!favoritesList) {
            const favoriteSection = document.createElement('li');
            favoriteSection.className = 'menu-item';
            favoriteSection.innerHTML = `
                <div class="sector-header active" title="Favoritos">
                    <i class="fas fa-star"></i>
                    <span class="text">Favoritos</span>
                    <i class="fas fa-chevron-right toggle-icon"></i>
                </div>
                <ul class="submenu active" id="favorites-list"></ul>
            `;
            menuList.prepend(favoriteSection);
            favoritesList = document.getElementById('favorites-list');
        }

        if (originalItem && !favoritesList.querySelector(`li[data-id="${dashboardId}"]`)) {
            const newItem = originalItem.cloneNode(true);
            favoritesList.appendChild(newItem);
        }
    } else {
        if (favoritesList) {
            const favoriteItem = favoritesList.querySelector(`li[data-id="${dashboardId}"]`);
            if (favoriteItem) {
                favoriteItem.remove();
            }

            if (favoritesList.children.length === 0) {
                const favoriteSection = favoritesList.closest('.menu-item');
                if (favoriteSection) {
                    favoriteSection.remove();
                }
            }
        }
    }
}

function getCsrfToken() {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
}