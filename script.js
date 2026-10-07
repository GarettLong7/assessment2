const animeList = [];

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