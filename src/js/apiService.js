// Імпортуємо необхідні бібліотеки
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Оголошуємо базові константи для API
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37718597-f2a776258a6c278a1ed771723';

// Ініціалізуємо змінні стану
let searchQuery = '';
let currentPage = 1;
let total = null;
let firstSearch = true;

export function updateFirstSearch(state) {
  firstSearch = state;
}

// Функція для переходу до наступної сторінки
export function nextPage() {
  currentPage += 1;
  return getImages();
}

// Функція для скидання номера сторінки до 1
export function resetPage() {
  currentPage = 1;
}

// Асинхронна функція для виконання API-запиту і отримання зображень
export async function getImages() {
  // Створюємо параметри запиту
  const params = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${currentPage}`,
    per_page: 40,
  });

  // Виконуємо запит
  try {
    const response = await axios.get(`${BASE_URL}?${params}`);

    total = response.data.total;
    if (firstSearch) {
      updateFirstSearch(false);
    }

    // Перетворюємо відповідь в бажаний формат
    let imagesData = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL.replace('_640', '_340'),
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
      likes: hit.likes,
    }));

    // Повертаємо дані
    return imagesData;
  } catch (error) {
    // Якщо виникає помилка, показуємо повідомлення
    Notify.failure(error.message);
  }
}

// Функція для оновлення пошукового запиту
export function setSearchQuery(newQuery) {
  searchQuery = newQuery;
}
