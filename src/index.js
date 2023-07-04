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

let form = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');
let loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  let searchQuery = evt.target.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.warning('Input field is empty or contains only spaces');
    return;
  }

  setSearchQuery(searchQuery);
  resetPage();
  updateFirstSearch(true);
  loadMoreBtn.hidden = true;
  gallery.innerHTML = '';

  getImages().then(function (data) {
    if (data.length === 0) {
      Notify.failure('Nothing found by Your request');
      loadMoreBtn.style.display = 'none';
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
    loadMoreBtn.hidden = false;
    loadMoreBtn.style.display = 'block';
  });

  evt.target.searchQuery.value = '';
});

loadMoreBtn.addEventListener('click', function () {
  nextPage().then(function (data) {
    if (data.length === 0) {
      Report.info(
        "We're sorry",
        "but you've reached the end of search results.",
        'Okay'
      );
      loadMoreBtn.hidden = true;
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
  });
});
