const animeList = [];

const animeForm = document.querySelector("#anime-form");
const titleInput = document.querySelector("#anime-title");
const statusInput = document.querySelector("#anime-status");
const ratingInput = document.querySelector("#anime-rating");
const listContainer = document.querySelector("#anime-list");

const submitButton = document.querySelector("#submit-button");
let editingId = null;

function addAnime(title, status, rating) {
  const anime = {
    id: Date.now(),
    title: title,
    status: status,
    rating: rating
  };

  animeList.push(anime);
  return anime;
}

function displayAnime() {
  // Clear the display before rebuilding it.
  listContainer.textContent = "";

  animeList.forEach(function (anime) {
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
      editingId = anime.id;

      titleInput.value = anime.title;
      statusInput.value = anime.status;
      ratingInput.value = anime.rating;

      titleInput.setCustomValidity("");
      submitButton.textContent = "Save Changes";
      titleInput.focus();
    });

    card.append(title, status, rating, editButton);
  });
}

animeForm.addEventListener("submit", function (event) {
  // Prevent the form from refreshing the page.
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
    const anime = animeList.find(function (anime) {
      return anime.id === editingId;
    });

    anime.title = title;
    anime.status = statusInput.value;
    anime.rating = ratingInput.value;

    editingId = null;
  }

  // Save both additions and edits if you're using localStorage.
  localStorage.setItem("animeList", JSON.strinify(animeList));

  displayAnime();
  animeForm.reset();
  submitButton.textContent = "Add Anime";
  titleInput.focus();
});

titleInput.addEventListener("input", function () {
  titleInput.setCustomValidity("");
});