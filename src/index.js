// Підключаємо різні модулі та файлі для роботи з анімацією, lightbox та API
import './js/animation';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  getImages,
  setSearchQuery,
  resetPage,
  nextPage,
} from './js/apiService';
import { createMarkup } from './js/markup';
import { Notify } from 'notiflix';

// Отримуємо доступ до елементів DOM
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Спочатку приховуємо кнопку "Load more"
loadMoreBtn.style.display = 'none';

// Додаємо обробник подій для форми
form.addEventListener('submit', onSubmit);

// Функція, яка запускається при відправці форми
function onSubmit(evt) {
  evt.preventDefault();

  // Перевіряємо, чи поле вводу не порожнє
  if (evt.target.searchQuery.value === '') {
    Notify.warning('Input field is empty');
    return;
  }

  // Задаємо запит для пошуку
  setSearchQuery(evt.target.searchQuery.value);

  // Скидаємо номер сторінки до 1
  resetPage();

  // Приховуємо кнопку "Load more" поки не отримаємо результати
  loadMoreBtn.hidden = true;

  // Отримуємо зображення з API
  getImages().then(data => {
    // Вставляємо отримані зображення в галерею
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));

    // Ініціалізуємо lightbox
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });

    // Показуємо кнопку "Load more"
    loadMoreBtn.hidden = false;
    loadMoreBtn.style.display = 'block';
  });
}

// Додаємо обробник подій для кнопки "Load more"
loadMoreBtn.addEventListener('click', onLoadMore);

// Функція, яка запускається при натисканні кнопки "Load more"
function onLoadMore() {
  // Завантажуємо наступну сторінку з результатами
  nextPage().then(renderGallery);
}

// Функція для додавання нових зображень в галерею
function renderGallery(data) {
  // Вставляємо отримані зображення в галерею
  gallery.insertAdjacentHTML('beforeend', createMarkup(data));

  // Ініціалізуємо lightbox для нових зображень
  new SimpleLightbox('.gallery a', {
    captionDelay: 200,
    captionsData: 'alt',
  });
}
