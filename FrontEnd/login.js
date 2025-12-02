const form = document.querySelector("form");
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message'); // La balise <p> vide

// 2. Écoute de l'événement
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

       // Récupération des valeurs
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

       try {
        // 3. Appel à l'API
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword
            })
        });

        // 4. Gestion de la réponse
        if (response.ok) {
            // --- SUCCÈS ---
            const data = await response.json();
            
            // Stockage du token (clé pour l'étape suivante)
            localStorage.setItem("token", data.token);
            
            // Redirection vers la page d'accueil
            window.location.href = "index.html"; 
            
        } else {
            // --- ERREUR (Mauvais mot de passe / email) ---
            // C'est ici que tu gères le design dynamique de l'erreur
            errorMessage.style.display = "block"; // Affiche le message
            emailInput.classList.add("input-error"); // Ajoute une bordure rouge (via CSS)
            passwordInput.classList.add("input-error");
        }

    } catch (error) {
        console.error("Erreur technique :", error);
    }
});