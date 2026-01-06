console.log("✅ api.js est bien chargé !");

const API_URL = "http://localhost:5678/api";

/*  * Récupère tous les travaux (Works) */

export async function getWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);/* Envoi de la requête GET */

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`)
        }

        return await response .json();
    }catch (error) {
        console.error ("Erreur lors de la récupération des travaux : , error");
        return [];  // Retourne un tableau vide pour ne pas faire planter l'affichage
    }
}

 /* Récupère toutes les catégories */

export async function getCategories() {/* Envoi de la requête GET */
    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response .json();
    }catch (error) {
        console.error ("Erreur lors de la récupération des travaux" , error);
        return [];  // Retourne un tableau vide pour ne pas faire planter l'affichage
    }
}

/* Fonction qui permet de lancer les 2 autres en même temps pour gagner du temps */
export async function fetchAllData() {
  const [works, categories] = await Promise.all([
    getWorks(),
    getCategories()
  ]);
  return { works, categories };
}