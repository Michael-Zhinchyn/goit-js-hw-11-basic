import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let BASE_URL = 'https://pixabay.com/api/';
let API_KEY = '37718597-f2a776258a6c278a1ed771723';
let searchQuery = '';
let currentPage = 1;
let total = null;
let firstSearch = true;

// Функція, що оновлює стан першого пошуку
export function updateFirstSearch(state) {
  firstSearch = state;
}

// Функція для переходу до наступної сторінки
export function nextPage() {
  currentPage = currentPage + 1;
  return getImages();
}

// Функція для скидання номера сторінки до 1
export function resetPage() {
  currentPage = 1;
}

// Функція, що виконує API-запит і отримує зображення
export async function getImages() {
  let params = {
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: 40,
  };

  try {
    let response = await axios.get(BASE_URL, { params: params });

    total = response.data.total;

    if (firstSearch) {
      updateFirstSearch(false);
    }

    let imagesData = response.data.hits.map(hit => {
      return {
        webformatURL: hit.webformatURL.replace('_640', '_340'),
        largeImageURL: hit.largeImageURL,
        tags: hit.tags,
        views: hit.views,
        comments: hit.comments,
        downloads: hit.downloads,
        likes: hit.likes,
      };
    });

    return imagesData;
  } catch (error) {
    Notify.failure('Помилка: ' + error.message);
  }
}

// Функція для оновлення пошукового запиту
export function setSearchQuery(newQuery) {
  searchQuery = newQuery;
}
