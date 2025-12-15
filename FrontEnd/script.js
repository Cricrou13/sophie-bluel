import { fetchAllData } from './API.js';
// On importe les fonctions d'affichage depuis DOM.js
import { renderGallery, renderFilters, toggleAdminMode } from './DOM.js';

console.log("✅ script.js est bien chargé !");

let allWorks = [];
let allCategories = [];

// Fonction principale
async function init() {
    // 1. Récupération des données
    const data = await fetchAllData();
    allWorks = data.works;
    allCategories = data.categories;

    // 2. Affichage initial de la galerie
    renderGallery(allWorks);

    // 3. Gestion de la connexion (Admin ou Visiteur)
    const token = localStorage.getItem('token');
    const isConnected = !!token; // Transforme en booléen (true/false)

    toggleAdminMode(isConnected, () => {
        // Fonction de déconnexion (callback)
        localStorage.removeItem("token");
        window.location.reload();
    });

    // 4. Si on est visiteur, on affiche les filtres
    if (!isConnected) {
        renderFilters(allCategories, (categoryId) => {
            // Logique de filtrage (Callback appelé quand on clique sur un bouton)
            filterWorks(categoryId);
        });
    }
}

// Fonction logique pour filtrer (ne s'occupe pas de l'affichage des boutons, juste du tri)
function filterWorks(categoryId) {
    if (categoryId === "all") {
        renderGallery(allWorks);
    } else {
        // Attention: categoryId des boutons est souvent un Number, vérifie le type si besoin
        const filtered = allWorks.filter(work => work.categoryId == categoryId);
        renderGallery(filtered);
    }
}

// Lancement
init();