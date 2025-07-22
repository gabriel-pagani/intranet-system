document.addEventListener("DOMContentLoaded", function () {
    const menuList = document.querySelector('.menu-list');
    if (!menuList) return;

    const dashboardFrame = document.getElementById("dashboard-frame");
    const dashboardPlaceholder = document.getElementById("dashboard-placeholder");

    // Usar delegação de eventos no menuList
    menuList.addEventListener('click', function(e) {
        const pinIcon = e.target.closest('.pin-icon');
        const dashboardLink = e.target.closest('.dashboard-link');
        const sectorHeader = e.target.closest('.sector-header');

        // Prioridade 1: Clicou no ícone de fixar
        if (pinIcon) {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(pinIcon);
        return;
    }

    // Prioridade 2: Clicou em um link de dashboard
    if (dashboardLink) {
        e.preventDefault();
        
        document.querySelectorAll(".dashboard-link").forEach((l) => l.classList.remove("active"));
        dashboardLink.classList.add("active");

        const dashboardUrl = dashboardLink.getAttribute("data-url");
        dashboardPlaceholder.style.display = "none";
        dashboardFrame.style.display = "block";
        dashboardFrame.src = dashboardUrl;
        return;
    }

    // Prioridade 3: Clicou no cabeçalho de um setor para expandir/recolher
    if (sectorHeader) {
        sectorHeader.classList.toggle("active");
        const submenu = sectorHeader.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle("active");
        }
    }
});
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
            // Atualiza todos os ícones para este dashboard
            document.querySelectorAll(`.pin-icon[data-id="${dashboardId}"]`).forEach(icon => {
                icon.classList.toggle('favorited', data.is_favorite);
                icon.title = data.is_favorite ? 'Desafixar dos favoritos' : 'Fixar nos favoritos';
            });
            // Move o item no DOM (opcional, mas melhora a UX)
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
            // Cria a seção de Favoritos se ela não existir
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
        // Remove o item da lista de favoritos
        if (favoritesList) {
            const favoriteItem = favoritesList.querySelector(`li[data-id="${dashboardId}"]`);
            if (favoriteItem) {
                favoriteItem.remove();
            }

            // Se a lista de favoritos ficar vazia, remove a seção inteira
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