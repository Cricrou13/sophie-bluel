import { fetchAllData } from './API.js'; // NOUVEAU
console.log("✅ script.js est bien chargé !");

const SELECTORS = { // NOUVEAU
  gallery: ".gallery",
  filters: ".filters-container",
  loginLink: "#nav-login a, nav ul li a[href='login.html']", 
  editBtn: ".editBtn",
  editionHeader: "#editionBtn"
};

let allWorks = [];
let allCategories = [];

// Fonction principale
async function init() {
  const data = await fetchAllData();
  allWorks = data.works;
  allCategories = data.categories;

  console.log("Categories recues :" , allCategories);

  renderGallery(allWorks);
  updateAuthInterface(); 
}

// Affichage des travaux
function createWorkElement(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure; //donne le résultat fini
}

// Affichage de la galerie
function renderGallery(works) {
    const gallery = document.querySelector(SELECTORS.gallery);
    gallery.innerHTML = "";

    const fragment = document.createDocumentFragment();

  works.forEach((work) => {
    const element = createWorkElement(work);
    fragment.appendChild(element);
  });

    gallery.appendChild(fragment);
}

// Génération des filtres
function renderFilters(categories) {
  const container = document.querySelector(SELECTORS.filters);
  container.innerHTML = "";

  const filters = [
    {id: "all", name: "Tous"}, 
    ...categories
  ];

  filters.forEach((filter) => {
    const btn = document.createElement("button");
    btn.textContent = filter.name;
    btn.classList.add("filters-buttons");

    btn.addEventListener("click", () => {
        document.querySelectorAll(".filters-buttons").forEach(b =>b.classList.remove("active"));
        btn.classList.add("active");

        handleFilterClick(filter.id);
    }); 
    
        container.appendChild(btn);
  });
}

 /*  FONCTIONS LOGIQUES */

function handleFilterClick(categoryId) {
  if (categoryId === "all") {
    renderGallery(allWorks);

  } else {
    const filtered = allWorks.filter(work => work.categoryId == categoryId);
    renderGallery(filtered);
  }
}

function updateAuthInterface() {
   // On récupère les éléments du DOM ICI
  const token = localStorage.getItem('token');
  const isConnected = !!token; // true si token existe, false sinon

  const filtersContainer = document.querySelector(SELECTORS.filters);
  const loginLink = document.querySelector(SELECTORS.loginLink);
  const editBtn = document.querySelector(SELECTORS.editBtn);
  const editionHeader = document.querySelector(SELECTORS.editionHeader);

if (isConnected) {
    // --- MODE CONNECTÉ ---
    if (filtersContainer) filtersContainer.style.display = 'none';
    if (editBtn) editBtn.style.display = 'flex';
    if (editionHeader) editionHeader.classList.remove("hidden");

    if (loginLink) {
      loginLink.textContent = 'logout';
      loginLink.href = "#";
      
      // Clone pour nettoyer les anciens événements

      const newLoginLink = loginLink.cloneNode(true);
      loginLink.parentNode.replaceChild(newLoginLink, loginLink);

      newLoginLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        localStorage.removeItem("token");
        window.location.reload();
      });
    }
  } else {
    // --- MODE VISITEUR ---
    if (filtersContainer) {
      filtersContainer.style.display = 'flex';
      renderFilters(allCategories); // C'est ici qu'on crée les boutons !
    }

    if (editBtn) editBtn.style.display = 'none';
    if (editionHeader) editionHeader.classList.add("hidden");

    if (loginLink) {
      loginLink.textContent = "login";
      loginLink.href = "login.html";
    }
}}

// Lancement
init();