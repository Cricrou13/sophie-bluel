import { fetchAllData, getWorks, getCategories } from './api.js';
import {renderGallery, renderFilters, toggleAdminMode, renderModalCategories} from'./dom.js';
console.log("✅ script.js est bien chargé !");
console.log("dom est chargé!");

let allWorks = [];
let allCategories = [];

window.updateMainGallery = async function() {
    const data = await fetchAllData();
    allWorks = data.works; // On met à jour la variable globale
    renderGallery(allWorks); // On redessine la galerie
}

function filterWorks(categoryId) {
    if (categoryId === "all") {
        renderGallery(allWorks);
    } else {
        // On filtre les travaux qui ont le même categoryId
        const filtered = allWorks.filter(work => work.categoryId == categoryId);
        renderGallery(filtered);
    }
}

// Logique de déconnexion
function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
}

// Gère l'aperçu de l'image quand on en choisit une
function setupModalPreview() {
    const inputPhoto = document.getElementById("photo-upload");
    const previewImg = document.getElementById("img-preview");
    
    // On cache les éléments par défaut du carré bleu (optionnel, selon ton CSS/HTML)
    const labelUpload = document.querySelector(".btn-upload");
    const iconImage = document.querySelector(".fa-image");
    const textInfo = document.querySelector(".add-photo-container p");

    if (inputPhoto) {
        inputPhoto.addEventListener("change", () => {
            const file = inputPhoto.files[0];
            if (file) {
                // Création de l'URL pour l'aperçu
                previewImg.src = URL.createObjectURL(file);
                previewImg.style.display = "block";
                
                // On cache le reste pour que l'image prenne toute la place
                if(labelUpload) labelUpload.style.display = "none"; 
                if(iconImage) iconImage.style.display = "none";
                if(textInfo) textInfo.style.display = "none";
            } 
        });
    }
}

// Gère l'envoi du formulaire au serveur
function setupAddPhotoForm() {
    const inputPhoto = document.getElementById("photo-upload"); 
    const form = document.getElementById("form-add-photo");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category-select");
   
    const btnValidate = document.getElementById("btn-validate");

 function checkForm() {
   
    if (inputPhoto.files[0] && titleInput.value.trim() !== "" && categorySelect.value !== "") {
        // Si c'est BON
        btnValidate.style.backgroundColor = "#1D6154";
        btnValidate.disabled = false; 
    } else {
        // S'IL MANQUE UN TRUC
        btnValidate.style.backgroundColor = "#A7A7A7"; 
        btnValidate.disabled = true;
    }
}   

    // On écoute le changement sur la photo
    inputPhoto.addEventListener("change", checkForm);

    // On écoute quand l'utilisateur tape dans le titre
    titleInput.addEventListener("input", checkForm);

    // On écoute quand l'utilisateur change la catégorie
    categorySelect.addEventListener("change", checkForm);

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // Empêche le rechargement de page

            const imageInput = document.getElementById("photo-upload");
            const titleInput = document.getElementById("title");
            const categorySelect = document.getElementById("category-select");

            // Vérification basique
            if (!imageInput.files[0] || !titleInput.value || !categorySelect.value) {
                alert("Merci de remplir tous les champs !");
                return;
            }

            // Création du paquet de données
            const formData = new FormData();
            formData.append("image", imageInput.files[0]);
            formData.append("title", titleInput.value);
            formData.append("category", categorySelect.value);

            const token = localStorage.getItem("token");

            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert("Projet ajouté avec succès !");
                    // On vide le formulaire
                    form.reset();
                    document.getElementById("img-preview").style.display = "none";

                    btnValidate.style.backgroundColor = "#A7A7A7";
                    btnValidate.disabled = true;

                        // Retour vers la galerie
                    viewGallery.style.display = "block";
                    viewAdd.style.display = "none";
                    arrowReturn.style.display = "none";

                    // Ajouter le nouveau work à la liste et réafficher
                    const newWork = await response.json();
                    allWorks.push(newWork);
                    renderGallery(allWorks);

                    if (typeof window.genererGalerieModal === "function") {
        window.genererGalerieModal();
                    }

                } else {
                    alert("Erreur lors de l'ajout.");
                }
            } catch (error) {
                console.error("Erreur :", error);
            }
        });
    }
}
            window.updateMainGallery = async function () {
                const data = await fetchAllData();
                allWorks = data.works;
                renderGallery(allWorks);
            }

// Initialisation
async function init() {
    // Récupération des données
    const data = await fetchAllData();
    allWorks = data.works;

    // Affichage initial de la galerie
    renderGallery(allWorks);
    renderModalCategories(data.categories);

    // Vérification de la connexion
    const token = localStorage.getItem('token');
    const isConnected = !!token;

    // Gestion de l'affichage selon le statut (Admin ou Visiteur)
    toggleAdminMode(isConnected, handleLogout);

    // Si visiteur, on génère les filtres

    if (!isConnected) {
        // On passe les catégories ET la fonction à exécuter lors du clic
        renderFilters(data.categories, (id) => {
            filterWorks(id);
        });

    } else {
        // On active la logique de la modale (Preview + Envoi formulaire)
        setupModalPreview();
        setupAddPhotoForm();
      }
}

// Démarrage
init();
