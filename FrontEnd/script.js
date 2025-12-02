let works = [];
let categories = [];

async function init() {
  try {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    works = await worksResponse.json();

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    categories = await categoriesResponse.json();

    displayFilters(categories);
    displayWorks(works);
  } catch (error) {
    console.error("Erreur lors du chargement :" , error);
  }
}

function displayWorks(filteredWorks) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = '';

  filteredWorks.forEach(work => {
    const workElement = document.createElement('div');
    workElement.classList.add('work');

    const image = document.createElement('img');
    image.src = work.imageUrl;
    image.alt = work.title;

    const title = document.createElement('h3');
    title.textContent = work.title;

    workElement.appendChild(image);
    workElement.appendChild(title);
    gallery.appendChild(workElement);
  })
}

// Gestion des filtres

function displayFilters(categories) {
  const filtersContainer = document.querySelector(".filters-buttons");
  filtersContainer.innerHTML ="";

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filters-buttons");
  allButton.setAttribute("data-category", "all");
  filtersContainer.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filters-buttons");
    button.setAttribute("data-category", category.id);
    filtersContainer.appendChild(button);
    console.log(button)
  });

  filtersContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("filters-buttons")) {
      const category = e.target.getAttribute('data-category');
      if (category === "all") {
        displayWorks(works);
      } else {
      const filtered = works.filter(work => work.categoryId.toString() === category);
      displayWorks(filtered);
      }
    }
  });
}
init();