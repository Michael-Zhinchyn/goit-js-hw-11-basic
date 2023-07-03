// Імпорт необхідних модулів
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

// Отримання доступу до елементів на сторінці
let form = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');
let loadMoreBtn = document.querySelector('.load-more');

// Приховуємо кнопку "Load More" на початку
loadMoreBtn.style.display = 'none';

// Додаємо слухач події до форми
form.addEventListener('submit', function (evt) {
  // Запобігаємо стандартній поведінці форми
  evt.preventDefault();

  // Перевіряємо чи поле пошуку не порожнє
  if (evt.target.searchQuery.value === '') {
    // Якщо поле пошуку порожнє, виводимо повідомлення
    Notify.warning('Input field is empty');
    return;
  }

  // Задаємо пошуковий запит
  setSearchQuery(evt.target.searchQuery.value);
  // Скидаємо номер сторінки до 1
  resetPage();
  // Оновлюємо стан першого пошуку
  updateFirstSearch(true);
  // Приховуємо кнопку "Load More" доки не отримаємо результати
  loadMoreBtn.hidden = true;
  // Очищуємо галерею
  gallery.innerHTML = '';

  // Робимо запит на отримання зображень
  getImages().then(function (data) {
    // Перевіряємо чи отримали дані
    if (data.length === 0) {
      // Якщо даних немає, виводимо повідомлення
      Notify.failure('Nothing found by Your request');
      loadMoreBtn.style.display = 'none';
      return;
    }

    // Додаємо отримані зображення до галереї
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    // Ініціалізуємо lightbox
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });

    // Показуємо кнопку "Load More"
    loadMoreBtn.hidden = false;
    loadMoreBtn.style.display = 'block';
  });

  // Очищуємо поле пошуку
  evt.target.searchQuery.value = '';
});

// Додаємо слухач події до кнопки "Load More"
loadMoreBtn.addEventListener('click', function () {
  // Завантажуємо наступну сторінку з результатами
  nextPage().then(function (data) {
    // Перевіряємо чи є дані
    if (data.length === 0) {
      // Якщо даних немає, виводимо повідомлення
      Report.info(
        "We're sorry",
        "but you've reached the end of search results.",
        'Okay'
      );
      // Приховуємо кнопку "Load More"
      loadMoreBtn.hidden = true;
      return;
    }

    // Додаємо отримані зображення до галереї
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    // Ініціалізуємо lightbox
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
  });
});
