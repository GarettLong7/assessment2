const animeList = JSON.parse(localStorage.getItem("animeList")) || [];

// Main form elements
const animeForm = document.querySelector("#anime-form");
const titleInput = document.querySelector("#anime-title");
const statusInput = document.querySelector("#anime-status");
const ratingInput = document.querySelector("#anime-rating");
const listContainer = document.querySelector("#anime-list");

// Edit popup elements
const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");
const editTitle = document.querySelector("#edit-title");
const editStatus = document.querySelector("#edit-status");
const editRating = document.querySelector("#edit-rating");
const cancelEdit = document.querySelector("#cancel-edit");

// Delete popup elements
const deleteDialog = document.querySelector("#delete-dialog");
const deleteMessage = document.querySelector("#delete-message");
const cancelDelete = document.querySelector("#cancel-delete");
const confirmDelete = document.querySelector("#confirm-delete");

let editingId = null;
let animeToDelete = null;

// Save the list in the browser.
function saveAnime() {
  localStorage.setItem("animeList", JSON.stringify(animeList));
}

// Reset the Add Anime form.
function resetForm() {
  animeForm.reset();
  titleInput.setCustomValidity("");
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

// Open and fill the Edit popup.
function editAnime(anime) {
  editingId = anime.id;

  editTitle.value = anime.title;
  editStatus.value = anime.status;
  editRating.value = anime.rating;

  editTitle.setCustomValidity("");
  editDialog.showModal();
}

// Apply changes to the selected anime.
function updateAnime(title, status, rating) {
  const anime = animeList.find(function (item) {
    return item.id === editingId;
  });

  if (!anime) return;

  anime.title = title;
  anime.status = status;
  anime.rating = rating;
}

// Open the Delete confirmation popup.
function deleteAnime(anime) {
  animeToDelete = anime;

  deleteMessage.textContent =
    'Delete "' + anime.title + '" from your list?';

  deleteDialog.showModal();
}

// Create one anime card.
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
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", function () {
    editAnime(anime);
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
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

  if (animeList.length === 0) {
    listContainer.textContent = "No anime yet. Add your first anime above!";
  }

  animeList.forEach(function (anime) {
    const card = createAnimeCard(anime);
    listContainer.append(card);
  });
}

// GET: retrieve a sample record.
async function getData() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  console.log(response.data);
}

// POST: send details to the practice API.
// This simulates saving; localStorage saves the actual list.
async function postData(title, status, rating) {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title: title,
      body: status + ", rating: " + rating,
      userId: 1
    }
  );

  console.log(response.data);
}

// Add an anime when the main form is submitted.
animeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (title === "") {
    titleInput.setCustomValidity("Please enter an anime title.");
    titleInput.reportValidity();
    return;
  }

  addAnime(title, statusInput.value, ratingInput.value);

  postData(title, statusInput.value, ratingInput.value)
    .catch(function (error) {
      console.error("POST failed:", error);
    });

  saveAnime();
  displayAnime();
  resetForm();
  titleInput.focus();
});

// Clear the main title error when typing.
titleInput.addEventListener("input", function () {
  titleInput.setCustomValidity("");
});

// Save changes from the Edit popup.
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = editTitle.value.trim();

  if (title === "") {
    editTitle.setCustomValidity("Please enter an anime title.");
    editTitle.reportValidity();
    return;
  }

  updateAnime(title, editStatus.value, editRating.value);

  saveAnime();
  displayAnime();
  editDialog.close();
});

// Clear the Edit title error when typing.
editTitle.addEventListener("input", function () {
  editTitle.setCustomValidity("");
});

// Cancel editing.
cancelEdit.addEventListener("click", function () {
  editDialog.close();
});

// Clean up after Save, Cancel, or Escape.
editDialog.addEventListener("close", function () {
  editingId = null;
  editForm.reset();
  editTitle.setCustomValidity("");
});

// Delete only after confirmation.
confirmDelete.addEventListener("click", function () {
  if (animeToDelete === null) return;

  const index = animeList.indexOf(animeToDelete);

  if (index !== -1) {
    animeList.splice(index, 1);
    saveAnime();
    displayAnime();
  }

  deleteDialog.close();
});

// Cancel deletion.
cancelDelete.addEventListener("click", function () {
  deleteDialog.close();
});

// Clear the selection after closing or pressing Escape.
deleteDialog.addEventListener("close", function () {
  animeToDelete = null;
});

// Display saved anime on page load.
displayAnime();

// Run GET on page load.
getData().catch(function (error) {
  console.error("GET failed:", error);
});