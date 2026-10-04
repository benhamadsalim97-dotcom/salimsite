// ===== Données des biens (simulées) =====
const biens = [
  {
    id: 1,
    titre: "Maison familiale avec jardin",
    type: "maison",
    prix: 185000,
    surface: 120,
    image: "images/maison.svg",
    description: "Belle maison de plain-pied avec jardin arboré, proche de l'école.",
    details: ["4 chambres", "2 salles de bain", "Garage", "Chauffage au gaz"]
  },
  {
    id: 2,
    titre: "Terrain constructible",
    type: "terrain",
    prix: 62000,
    surface: 800,
    image: "images/terrain.svg",
    description: "Terrain plat et viabilisé, idéal pour construire votre maison.",
    details: ["Viabilisé", "Zone constructible", "Vue dégagée"]
  },
  {
    id: 3,
    titre: "Local commercial centre-village",
    type: "commerce",
    prix: 120000,
    surface: 90,
    image: "images/commerce.svg",
    description: "Local idéal pour boutique ou café, en plein centre de Nouiel.",
    details: ["Vitrine", "Passage fréquent", "Arrière-boutique"]
  },
  {
    id: 4,
    titre: "Petite maison de village",
    type: "maison",
    prix: 95000,
    surface: 70,
    image: "images/maison.svg",
    description: "Maison en pierre rénovée, parfaite pour un premier achat.",
    details: ["2 chambres", "1 salle de bain", "Cour privée"]
  },
  {
    id: 5,
    titre: "Grand terrain agricole",
    type: "terrain",
    prix: 40000,
    surface: 5000,
    image: "images/terrain.svg",
    description: "Grand terrain en bordure de village, à usage agricole ou loisirs.",
    details: ["Accès direct", "Point d'eau", "Calme absolu"]
  }
];

// ===== Éléments du DOM =====
const listingsEl = document.getElementById("listings");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");
const resultCount = document.getElementById("resultCount");
const noResult = document.getElementById("noResult");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

// ===== Formatage =====
function formaterPrix(valeur) {
  return valeur.toLocaleString("fr-FR") + " €";
}

// ===== Filtrage et tri =====
function filtrerEtTrier() {
  const recherche = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const tri = sortFilter.value;

  // 1. Filtrer par texte et par type
  let resultat = biens.filter(bien => {
    const correspondTexte =
      bien.titre.toLowerCase().includes(recherche) ||
      bien.description.toLowerCase().includes(recherche);
    const correspondType = type === "all" || bien.type === type;
    return correspondTexte && correspondType;
  });

  // 2. Trier
  switch (tri) {
    case "prix-asc":
      resultat.sort((a, b) => a.prix - b.prix);
      break;
    case "prix-desc":
      resultat.sort((a, b) => b.prix - a.prix);
      break;
    case "surface":
      resultat.sort((a, b) => b.surface - a.surface);
      break;
    default:
      resultat.sort((a, b) => a.id - b.id);
  }

  return resultat;
}

// ===== Affichage des cartes =====
function afficherBiens() {
  const liste = filtrerEtTrier();

  listingsEl.innerHTML = "";
  liste.forEach(bien => {
    const carte = document.createElement("article");
    carte.className = "card";
    carte.innerHTML = `
      <img src="${bien.image}" alt="${bien.titre}">
      <div class="card-body">
        <h3>${bien.titre}</h3>
        <p class="type">${bien.type} · ${bien.surface} m²</p>
        <p class="price">${formaterPrix(bien.prix)}</p>
      </div>
    `;
    carte.addEventListener("click", () => ouvrirModal(bien.id));
    listingsEl.appendChild(carte);
  });

  resultCount.textContent = `${liste.length} bien(s) trouvé(s)`;
  noResult.hidden = liste.length > 0;
}

// ===== Fenêtre de détail =====
function ouvrirModal(id) {
  const bien = biens.find(b => b.id === id);
  if (!bien) return;

  document.getElementById("modalImg").src = bien.image;
  document.getElementById("modalImg").alt = bien.titre;
  document.getElementById("modalTitle").textContent = bien.titre;
  document.getElementById("modalPrice").textContent = formaterPrix(bien.prix);
  document.getElementById("modalDesc").textContent = bien.description;

  const ul = document.getElementById("modalDetails");
  ul.innerHTML = "";
  bien.details.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d;
    ul.appendChild(li);
  });

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function fermerModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", fermerModal);
modal.addEventListener("click", e => {
  if (e.target === modal) fermerModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) fermerModal();
});
document.getElementById("modalContact").addEventListener("click", fermerModal);

// ===== Menu mobile =====
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(lien =>
  lien.addEventListener("click", () => nav.classList.remove("open"))
);

// ===== Filtres =====
searchInput.addEventListener("input", afficherBiens);
typeFilter.addEventListener("change", afficherBiens);
sortFilter.addEventListener("change", afficherBiens);

// ===== Formulaire de contact avec validation =====
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function validerFormulaire() {
  const valeurs = {
    nom: form.nom.value.trim(),
    email: form.email.value.trim(),
    objet: form.objet.value,
    message: form.message.value.trim()
  };

  const erreurs = {};
  if (valeurs.nom.length < 2) {
    erreurs.nom = "Le nom doit contenir au moins 2 caractères.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeurs.email)) {
    erreurs.email = "Adresse e-mail invalide.";
  }
  if (!valeurs.objet) {
    erreurs.objet = "Veuillez choisir un objet.";
  }
  if (valeurs.message.length < 10) {
    erreurs.message = "Le message doit contenir au moins 10 caractères.";
  }
  return erreurs;
}

function afficherErreurs(erreurs) {
  form.querySelectorAll(".error").forEach(span => {
    span.textContent = erreurs[span.dataset.for] || "";
  });
  form.querySelectorAll("input, select, textarea").forEach(champ => {
    champ.classList.toggle("invalid", Boolean(erreurs[champ.name]));
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const erreurs = validerFormulaire();
  afficherErreurs(erreurs);

  if (Object.keys(erreurs).length === 0) {
    formSuccess.hidden = false;
    form.reset();
    setTimeout(() => (formSuccess.hidden = true), 4000);
  } else {
    formSuccess.hidden = true;
  }
});

// ===== Initialisation =====
afficherBiens();
