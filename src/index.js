import './js/animation';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImages, setSearchQuery } from './js/apiService';
import { createMarkup } from './js/markup';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  setSearchQuery(evt.target.searchQuery.value);

  getImages().then(data => {
    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
  });
}
