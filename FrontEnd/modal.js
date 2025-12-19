const modal = document.getElementById("modal");
const btnClose = document.getElementById("btn-close");
const viewGallery = document.getElementById("modal-gallery-view");
const viewAdd = document.getElementById("modal-add-view");
const btnAddPhoto = document.getElementById("btn-add-photo-view");
const arrowReturn = document.getElementById("arrow-return");

// Éléments upload
const inputPhoto = document.getElementById("photo-upload");
const previewImg = document.getElementById("img-preview");
const labelUpload = document.querySelector(".btn-upload");
const iconImage = document.querySelector(".fa-image");
const textInfo = document.querySelector(".add-photo-container p");

 /*  1. GÉNÉRER LA GALERIE DANS LA MODALE */

async function genererGalerieModal() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const galleryDiv = document.querySelector(".modal-gallery");
        
        if (!galleryDiv) return;
        galleryDiv.innerHTML = ""; 

        works.forEach(work => {
            const figure = document.createElement("figure");
            // CORRECTION : On assigne l'ID exact ici
            figure.id = `modal-photo-${work.id}`; 
            
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

            // CORRECTION : On passe work.id (et pas juste id)
            trashIcon.addEventListener("click", (e) => {
                e.preventDefault();
                deleteWork(work.id);
            });

            figure.appendChild(img);
            figure.appendChild(trashIcon);
            galleryDiv.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors du chargement de la modale:", error);
    }
}
window.genererGalerieModal = genererGalerieModal;


/* SUPPRIMER UN PROJET */

async function deleteWork(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            // A. Supprimer de la modale
            const figureModal = document.getElementById(`modal-photo-${id}`);
            if (figureModal) {
                figureModal.remove();
            }

            // B. Supprimer de la galerie principale (id défini dans dom.js)
            const figureMain = document.getElementById(`work_${id}`);
            if (figureMain) {
                figureMain.remove();
            }

            // C. Mise à jour de la variable globale pour les filtres
            if (typeof window.removeWorkFromList === "function") {
                window.removeWorkFromList(id);
            }
        } else {
            alert("Erreur lors de la suppression.");
        }
    } catch (error) {
        console.error("Erreur réseau suppression:", error);
    }
}


/*GESTION DES ÉVÉNEMENTS (OUVERTURE / FERMETURE) */

const openModal = function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    genererGalerieModal();
};

const closeModal = function () {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    // Reset vue modale
    viewGallery.style.display = "block";
    viewAdd.style.display = "none";
    arrowReturn.style.display = "none";
};

// Listener pour ouvrir (Modifier)
document.addEventListener("click", (e) => {
    if (e.target.closest(".editBtn") || e.target.closest(".js-modal-trigger")) {
        openModal(e);
    }
});

if (btnClose) btnClose.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

/* NAVIGATION INTERNE MODALE */

if (btnAddPhoto) {
    btnAddPhoto.addEventListener("click", () => {
        viewGallery.style.display = "none";
        viewAdd.style.display = "block";
        arrowReturn.style.display = "block";
    });
}

if (arrowReturn) {
    arrowReturn.addEventListener("click", () => {
        viewGallery.style.display = "block";
        viewAdd.style.display = "none";
        arrowReturn.style.display = "none";
    });
}

// Preview image

if (inputPhoto) {
    inputPhoto.addEventListener("change", () => {
        const file = inputPhoto.files[0];
        if (file) {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";
            if (labelUpload) labelUpload.style.display = "none";
            if (iconImage) iconImage.style.display = "none";
            if (textInfo) textInfo.style.display = "none";
        }
    });
}
