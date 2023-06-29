// Імпортую бібліотеки
import axios from 'axios';
import SimpleLightbox from 'simplelightbox'; // Імпортуємо модуль SimpleLightbox
import 'simplelightbox/dist/simple-lightbox.min.css'; // Імпортуємо стилі для SimpleLightbox

import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Оголошую глобальні змінні
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37718597-f2a776258a6c278a1ed771723';
let searchQuery = '';
let page = 1;

async function getImages() {
  const params = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 1,
    per_page: 40,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    console.log(response);
    let imagesData = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL,
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

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.target.searchQuery.value;

  getImages().then(data => {
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
  });
}

function createMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        views,
        comments,
        downloads,
        likes,
      }) =>
        `<div class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </a>
</div>`
    )
    .join('');
}
