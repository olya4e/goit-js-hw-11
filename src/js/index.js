import '../css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'Simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabyApi } from './pixabayApi';
import createGalleryCards from '../templates/galleryCards.hbs';
import simpleLightbox from 'simplelightbox';
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayApi = new PixabyApi();

const onLoadMoreBtnClick = e => {
  pixabayApi.page += 1;

  pixabayApi
    .getPhotoByQuery()
    .then(response => {
      const { data } = response;

      if (pixabayApi.page * Number(pixabayApi.photoPerPage) > data.totalHits) {
        loadMoreBtnEl.classList.add('is-hidden');
        loadMoreBtnEl.removeEventListener('click', onLoadMoreBtnClick);
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }

      galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
      simpleLightbox = new SimpleLightbox('.gallery a').refresh();
    })
    .catch(err => {
      console.log(err);
    });
};

const onSearchFormElSubmit = e => {
  e.preventDefault();

  pixabayApi.searchQuery = e.currentTarget.elements.searchQuery.value;
  pixabayApi.page = 1;
  if (pixabayApi.searchQuery === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  pixabayApi
    .getPhotoByQuery()
    .then(response => {
      const { data } = response;
      if (data.totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      if (data.totalHits === 0) {
        Notiflix.Notify.failure(`No images found for your request`);
        return;
      }
      if (pixabayApi.page * Number(pixabayApi.photoPerPage) > data.totalHits) {
        galleryEl.innerHTML = createGalleryCards(data.hits);
        loadMoreBtnEl.classList.add('is-hidden');
        simpleLightbox = new SimpleLightbox('.gallery a');
        return;
      } else {
        galleryEl.innerHTML = createGalleryCards(data.hits);
        loadMoreBtnEl.classList.remove('is-hidden');
        loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
        simpleLightbox = new SimpleLightbox('.gallery a');
      }
    })
    .catch(err => {
      console.log(err);
    });
};
searchFormEl.addEventListener('submit', onSearchFormElSubmit);
