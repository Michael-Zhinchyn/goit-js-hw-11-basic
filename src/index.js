// Підключаємо різні модулі та файлі для роботи з анімацією, lightbox та API
import './js/animation';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  getImages,
  setSearchQuery,
  resetPage,
  nextPage,
  updateFirstSearch,
} from './js/apiService';
import { createMarkup } from './js/markup';
import { Notify } from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';

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

  // Оновлюємо стан першого пошуку
  updateFirstSearch(true);

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

  // Очищуємо поле вводу
  evt.target.searchQuery.value = '';

  // Очищуємо галерею
  gallery.innerHTML = '';
}

// Додаємо обробник подій для кнопки "Load more"
loadMoreBtn.addEventListener('click', onLoadMore);

// Функція, яка запускається при натисканні кнопки "Load more"
function onLoadMore() {
  // Завантажуємо наступну сторінку з результатами
  nextPage().then(data => {
    if (!data.length) {
      Report.info(
        "We're sorry",
        "but you've reached the end of search results.",
        'Okay'
      );
      loadMoreBtn.hidden = true;
    } else {
      renderGallery(data);
    }
  });
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
