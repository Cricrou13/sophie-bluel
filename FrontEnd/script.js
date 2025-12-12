let works = [];
let categories = [];

// Fonction principale
async function init() {
  try {
    // Récupération des données API
    const worksResponse = await fetch("http://localhost:5678/api/works");
    works = await worksResponse.json();

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    categories = await categoriesResponse.json();

    // On affiche la galerie
    displayWorks(works);

    // afficher ou cacher les filtres
    checkLoginAndDisplayFilters();

  } catch (error) {
    console.error("Erreur lors du chargement :", error);
  }
}

// Affichage des travaux
function displayWorks(filteredWorks) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  filteredWorks.forEach((work) => {
    const figure = document.createElement("figure");
    
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
    })
  };

// Génération des filtres
function displayFilters(categories) {
  const filtersContainer = document.querySelector(".filters-container");

  // si pas de conteneur, on s'arrête
  if (!filtersContainer) {
    return;
  }

  filtersContainer.innerHTML = "";

  // Boutons
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filters-buttons");
  allButton.setAttribute("data-category", "all");
  filtersContainer.appendChild(allButton);

  // Autres boutons
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filters-buttons");
    button.setAttribute("data-category", category.id);
    filtersContainer.appendChild(button);
  });

  // Événements au clic
  filtersContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filters-buttons")) {
      const categoryId = e.target.getAttribute("data-category");
      if (categoryId === "all") {
        displayWorks(works);
      } else {
        const filtered = works.filter(
          (work) => work.categoryId.toString() === categoryId
        );
        displayWorks(filtered);
      }
    }
  });
}

// Gestion de la connexion et de l'affichage
function checkLoginAndDisplayFilters() {
  const token = localStorage.getItem('token');
  const filtersContainer = document.querySelector('.filters-container');
  
  const loginLink = document.getElementById("nav-login") || document.querySelector('nav ul li a[href="login.html"]');

  const editBtn = document.querySelector(".editBtn");

  const editionBtn = document.getElementById("editionBtn");

  console.log("editionBtn :", editionBtn);

  if (token) {
    // --- CONNECTÉ ---
    console.log("Mode connecté activé");

    // Cacher les filtres
    if (filtersContainer) {
      filtersContainer.style.display = 'none';
    }

    // Changer Login en Logout
    if (loginLink) {
      loginLink.textContent = 'logout';
      loginLink.href = "#";

      // On recrée l'élément pour supprimer les anciens écouteurs d'événements
      const newLoginLink = loginLink.cloneNode(true);
      loginLink.parentNode.replaceChild(newLoginLink, loginLink);

      newLoginLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        localStorage.removeItem("token"); // Supprime le token
        window.location.reload(); // Recharge la page pour réinitialiser
      });
    }

    if (editBtn) {
      editBtn.classList.remove("hidden");
    }

  } else {
    // --- NON CONNECTÉ ---
    console.log("Mode visiteur activé");

    // Afficher les filtres
    if (filtersContainer) {
      filtersContainer.style.display = 'flex';
      // C'EST ICI QU'ON APPELLE LA CRÉATION DES BOUTONS
      displayFilters(categories); 
    }

    if (editBtn) {
      editBtn.style.display='none';
    }

    // Remettre le bouton Login normal
    if (loginLink) {
      loginLink.textContent = "login";
      loginLink.href = "login.html";
    }

    if (editionBtn) {
      editionBtn.classList.add("hidden");
    }
  }
}

// Lancement du script
init();