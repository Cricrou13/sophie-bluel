const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message"); // La balise <p> vide

// Écoute de l'événement
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupération des valeurs
  const userEmail = emailInput.value;
  const userPassword = passwordInput.value;

  try {
    // Appel à l'API
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });

    // Gestion de la réponse
    if (response.ok) {
      // --- SUCCÈS ---
      const data = await response.json();

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem("token", data.token);
      // Stockage du token (clé pour l'étape suivante)
    

      // Redirection vers la page d'accueil
      window.location.href = "index.html";
    } else {
      // --- ERREUR (Mauvais mot de passe / email) ---
      errorMessage.style.display = "block";
      emailInput.classList.add("input-error");
      passwordInput.classList.add("input-error");
    }
  } catch (error) {
    console.error("Erreur technique :", error);
  }
});
