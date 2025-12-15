const SELECTORS = { // NOUVEAU
  gallery: ".gallery",
  filters: ".filters-container",
  loginLink: "#nav-login a, nav ul li a[href='login.html']", 
  editBtn: ".editBtn",
  editionHeader: "#editionBtn"
};

export function renderGallery(works) {
    const gallery = document.querySelector(SELECTORS.gallery);
    if(!gallery) return;

    gallery.innerHTML = "";
    const fragment = document.createDocumentFragment();

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        fragment.appendChild(figure);
    });

    gallery.appendChild(fragment);
}

export function renderFilters(categories, onFilterClick) {
    const container = document.querySelector(SELECTORS.filters);
    if (!container) return;
    
    container.innerHTML = "";

    const allFilters = [{id: "all", name: "Tous"}, ...categories];

    allFilters.forEach(filter => {
        const btn = document.createElement("button");
        btn.textContent = filter.name;
        btn.classList.add("filters-buttons");
        
        // Gestion visuelle du bouton actif
        if (filter.id === "all") btn.classList.add("active");

        btn.addEventListener("click", () => {
            document.querySelectorAll(".filters-buttons").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // On prévient le chef d'orchestre que ça a cliqué
            onFilterClick(filter.id);
        });

        container.appendChild(btn);
    });
}

export function toggleAdminMode(isConnected, handleLogout) {
    const filtersContainer = document.querySelector(SELECTORS.filters);
    const loginLink = document.querySelector(SELECTORS.loginLink);
    const editBtn = document.querySelector(SELECTORS.editBtn);
    const editionHeader = document.querySelector(SELECTORS.editionHeader);

    if (isConnected) {
        // Affiche mode Admin
        if (filtersContainer) filtersContainer.style.display = 'none';
        if (editBtn) editBtn.style.display = 'flex';
        if (editionHeader) editionHeader.classList.remove("hidden");

        if (loginLink) {
            loginLink.textContent = 'logout';
            loginLink.href = "#";
            // On remplace le comportement par défaut par la fonction de déconnexion
            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    } else {
        // Affiche mode Visiteur
        if (filtersContainer) filtersContainer.style.display = 'flex';
        if (editBtn) editBtn.style.display = 'none';
        if (editionHeader) editionHeader.classList.add("hidden");

        if (loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }
    }
}

export function renderModalCategories(categories) {
    const select = document.getElementById("category-select");
    if (!select) return;

    select.innerHTML = ""; // Vider
    
    // Option vide par défaut
    const empty = document.createElement("option");
    empty.value = "";
    select.appendChild(empty);

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}