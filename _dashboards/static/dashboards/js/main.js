document.addEventListener("DOMContentLoaded", function () {
  // Toggle sector submenus
  const sectorHeaders = document.querySelectorAll(".sector-header");
  sectorHeaders.forEach((header) => {
    header.addEventListener("click", function (e) {
      if (e.target.classList.contains('pin-icon')) return;
      this.classList.toggle("active");

      // Toggle submenu visibility
      const submenu = this.nextElementSibling;
      submenu.classList.toggle("active");
    });
  });

  // Handle dashboard link clicks to update iframe
  const dashboardLinks = document.querySelectorAll(".dashboard-link");
  const dashboardFrame = document.getElementById("dashboard-frame");
  const dashboardPlaceholder = document.getElementById("dashboard-placeholder");

  dashboardLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.classList.contains('pin-icon')) return;

      // Remove active class from all dashboard links
      dashboardLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Update iframe source with dashboard URL
      const dashboardUrl = this.getAttribute("data-url");

      // Hide placeholder and show iframe
      dashboardPlaceholder.style.display = "none";
      dashboardFrame.style.display = "block";
      dashboardFrame.src = dashboardUrl;
    });
  });

  // Handle pin/unpin clicks
  const menuList = document.querySelector('.menu-list');
  menuList.addEventListener('click', function(e) {
      if (e.target.classList.contains('pin-icon')) {
          e.stopPropagation();
          e.preventDefault();
          toggleFavorite(e.target);
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

    if (isFavorite) {
        if (!favoritesList) {
            // Cria a seção de Favoritos se ela não existir
            const favoriteSection = document.createElement('li');
            favoriteSection.className = 'menu-item';
            favoriteSection.innerHTML = `
                <div class="sector-header active" title="Favoritos">
                    <i class="fas fa-star"></i>
                    <span class="text">Favoritos</span>
                    <i class="fas fa-chevron-right toggle-icon" style="transform: rotate(90deg);"></i>
                </div>
                <ul class="submenu active" id="favorites-list"></ul>
            `;
            menuList.prepend(favoriteSection);
            favoritesList = document.getElementById('favorites-list');
        }

        // Clona o item do dashboard e adiciona aos favoritos
        const originalItem = document.querySelector(`.submenu:not(#favorites-list) li[data-id="${dashboardId}"]`);
        if (originalItem) {
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