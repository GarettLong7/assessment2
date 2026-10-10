const animeList = JSON.parse(localStorage.getItem("animeList")) || [];

const animeForm = document.querySelector("#anime-form");
const titleInput = document.querySelector("#anime-title");
const statusInput = document.querySelector("#anime-status");
const ratingInput = document.querySelector("#anime-rating");
const listContainer = document.querySelector("#anime-list");
const submitButton = document.querySelector("#submit-button");

let editingId = null;

// Save the list in the browser.
function saveAnime() {
  localStorage.setItem("animeList", JSON.stringify(animeList));
}

// Return the form to adding mode.
function resetForm() {
  editingId = null;
  animeForm.reset();
  titleInput.setCustomValidity("");
  submitButton.textContent = "Add Anime";
}

// Add one anime to the array.
function addAnime(title, status, rating) {
  const anime = {
    id: crypto.randomUUID(),
    title: title,
    status: status,
    rating: rating
  };

  animeList.push(anime);
}

// Fill the form with the selected anime's details.
function editAnime(anime) {
  editingId = anime.id;

  titleInput.value = anime.title;
  statusInput.value = anime.status;
  ratingInput.value = anime.rating;

  titleInput.setCustomValidity("");
  submitButton.textContent = "Save Changes";
  titleInput.focus();
}

// Update an existing anime's details.
function updateAnime(title, status, rating) {
  const anime = animeList.find(function (item) {
    return item.id === editingId;
  });

  if (!anime) return;

  anime.title = title;
  anime.status = status;
  anime.rating = rating;
}

// Remove the selected anime.
function deleteAnime(anime) {
  const index = animeList.indexOf(anime);

  if (index === -1) return;

  animeList.splice(index, 1);

  if (editingId === anime.id) {
    resetForm();
  }

  saveAnime();
  displayAnime();
}

// Create one card and its buttons.
function createAnimeCard(anime) {
  const card = document.createElement("div");
  card.className = "anime-card";

  const title = document.createElement("h3");
  title.textContent = anime.title;

  const status = document.createElement("p");
  status.textContent = "Status: " + anime.status;

  const rating = document.createElement("p");
  rating.textContent =
    "Rating: " + (anime.rating === "" ? "Not rated" : anime.rating + "/10");

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", function () {
    editAnime(anime);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function () {
    deleteAnime(anime);
  });

  card.append(title, status, rating, editButton, deleteButton);

  return card;
}

// Display all anime cards.
function displayAnime() {
  listContainer.textContent = "";

  animeList.forEach(function (anime) {
    const card = createAnimeCard(anime);
    listContainer.append(card);
  });
}

// Add or update an anime when the form is submitted.
animeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (title === "") {
    titleInput.setCustomValidity("Please enter an anime title.");
    titleInput.reportValidity();
    return;
  }

  if (editingId === null) {
    addAnime(title, statusInput.value, ratingInput.value);
  } else {
    updateAnime(title, statusInput.value, ratingInput.value);
  }

  saveAnime();
  displayAnime();
  resetForm();
  titleInput.focus();
});

// Clear the custom error when the title is edited.
titleInput.addEventListener("input", function () {
  titleInput.setCustomValidity("");
});

// Display saved anime when the page opens.
displayAnime();