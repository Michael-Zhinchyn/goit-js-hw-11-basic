import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37718597-f2a776258a6c278a1ed771723';
let searchQuery = '';
let currentPage = 1;

export function nextPage() {
  currentPage += 1;
  return getImages();
}

export function resetPage() {
  currentPage = 1;
}

export async function getImages() {
  const params = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${currentPage}`,
    per_page: 40,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    let imagesData = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL.replace('_640', '_340'),
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
      likes: hit.likes,
    }));

    return imagesData;
  } catch (error) {
    Notify.failure(error.message);
  }
}

export function setSearchQuery(newQuery) {
  searchQuery = newQuery;
}
