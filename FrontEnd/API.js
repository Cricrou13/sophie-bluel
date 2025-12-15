console.log("✅ API.js est bien chargé !");

const API_URL = "http://localhost:5678/api";

/*  * Récupère tous les travaux (Works) */
/*  @returns {Promise<Array>} */

export async function getWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);

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
/*  @returns {Promise<Array>} */

export async function getCategories() {
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

export async function fetchAllData() {
  const [works, categories] = await Promise.all([
    getWorks(),
    getCategories()
  ]);
  return { works, categories };
}