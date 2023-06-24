// Імпортую бібліотеки
import { Notify } from 'notiflix/build/notiflix-notify-aio';
//  Notify.Failure('Щось пішло не так'); використати в обробці помилок промісів

// Оголошую глобальні змінні
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37718597-f2a776258a6c278a1ed771723';

function getPosts() {
  const params = new URLSearchParams({
    limit: 40,
    page: 1,
  });

  const options = {
    method: 'GET',
    headers: {
      Authorization,
    },
  };
}
