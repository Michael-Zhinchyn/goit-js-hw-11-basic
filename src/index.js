import './js/animation';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import {
  getImages,
  setSearchQuery,
  resetPage,
  nextPage,
} from './js/apiService'; // import resetPage and nextPage
import { createMarkup } from './js/markup';
import { Notify } from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();

  if (evt.target.searchQuery.value === '') {
    Notify.warning('Input field is empty');
    return;
  }
  setSearchQuery(evt.target.searchQuery.value);
  resetPage();
  loadMoreBtn.hidden = true; // hide button before getting images
  getImages().then(data => {
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
    loadMoreBtn.hidden = false; // show button after images were loaded
    loadMoreBtn.style.display = 'block';
  });
}

loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  nextPage().then(renderGallery); // load next page on button click
}

function renderGallery(data) {
  gallery.insertAdjacentHTML('beforeend', createMarkup(data));
  new SimpleLightbox('.gallery a', {
    captionDelay: 200,
    captionsData: 'alt',
  });
}
