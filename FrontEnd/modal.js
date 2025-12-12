const modal = document.getElementById("modal");
const btnClose = document.getElementById("btn-close");

document.addEventListener("click", (e) => {
    // On vérifie si l'élément cliqué (ou un de ses parents) est le bouton d'édition
    // Note : J'ai ajouté la compatibilité avec ton ID "editionBtn" vu dans ta console
    const target = e.target.closest(".js-modal-trigger") || e.target.closest(".editBtn");

    if (target) {
        e.preventDefault(); // Empêcher le comportement par défaut si c'est un lien
        const modal = document.getElementById("modal");

        if (modal) {
            modal.style.display = "flex";
            genererGalerieModal(); // On charge les images
        }
    }
});

// Fermeture au clic sur la croix
btnClose.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fermeture au clic en dehors de la boîte (sur l'overlay)
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

async function genererGalerieModal() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    const galleryDiv = document.querySelector(".modal-gallery");
    galleryDiv.innerHTML = ""; // Vider avant de remplir

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.style.position = "relative"; // Pour placer l'icône
        
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.style.width = "100%";

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
        trashIcon.id = work.id; // IMPORTANT : stocker l'ID pour la suppression

        // Gestion de la suppression au clic
        trashIcon.addEventListener("click", () => {
            deleteWork(work.id); 
        });

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        galleryDiv.appendChild(figure);
    });
}

async function deleteWork(id) {
    const token = localStorage.getItem("token"); // Récupérer le token

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Recharger la galerie pour voir la disparition
            genererGalerieModal(); 
            // Optionnel : Mettre à jour aussi la galerie principale sans recharger la page
        } else {
            console.error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error("Erreur réseau", error);
    }
}

const viewGallery = document.getElementById("modal-gallery-view");
const viewAdd = document.getElementById("modal-add-view");
const btnAddPhoto = document.getElementById("btn-add-photo-view");
const arrowReturn = document.getElementById("arrow-return");

// Aller vers l'ajout
btnAddPhoto.addEventListener("click", () => {
    viewGallery.style.display = "none";
    viewAdd.style.display = "block";
    arrowReturn.style.display = "block"; // Afficher la flèche retour
});

// Retour vers la galerie
arrowReturn.addEventListener("click", () => {
    viewGallery.style.display = "block";
    viewAdd.style.display = "none";
    arrowReturn.style.display = "none";
});

const inputPhoto = document.getElementById("photo-upload");
const previewImg = document.getElementById("img-preview");

inputPhoto.addEventListener("change", () => {
    const file = inputPhoto.files[0];
    if (file) {
        // Créer un URL temporaire pour l'image
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
        // Cacher le label et l'icône par CSS si besoin
    }
});

const formAdd = document.getElementById("form-add-photo");

formAdd.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    const formData = new FormData();
    formData.append("image", document.getElementById("photo-upload").files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category-select").value);

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` 
                // NE PAS METTRE 'Content-Type': 'application/json' AVEC FORMDATA
                // Le navigateur le gère tout seul pour le multipart/form-data
            },
            body: formData
        });

        if (response.ok) {
            alert("Photo ajoutée avec succès !");
            // Vider le formulaire et revenir à la galerie
            formAdd.reset();
            previewImg.style.display = "none";
            // Revenir vue 1...
        }
    } catch (error) {
        console.error(error);
    }
});