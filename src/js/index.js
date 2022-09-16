import '../css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabyApi } from './pixabayApi';
import createGalleryCards from '../templates/galleryCards.hbs';
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');
const targetEl = document.querySelector('.target-element');

const pixabayApi = new PixabyApi();
const totalHitsQuery = pixabayApi.page * Number(pixabayApi.photoPerPage);

const paintRandomPhotosByPageLoad = async () => {
  try {
    pixabayApi.searchQuery = 'popular';
    const { data } = await pixabayApi.getPhotoByQuery();
    galleryEl.innerHTML = createGalleryCards(data.hits);
    simpleLightbox = new SimpleLightbox('.gallery a');
  } catch (err) {
    console.log(err);
  }
};
paintRandomPhotosByPageLoad();

const onLoadMoreBtnClick = async e => {
  try {
    pixabayApi.page += 1;
    const { data } = await pixabayApi.getPhotoByQuery();
    const totalPage = Math.ceil(data.totalHits / pixabayApi.photoPerPage);

    if (pixabayApi.page > totalPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      loadMoreBtnEl.removeEventListener('click', onLoadMoreBtnClick);
      notifyEndResult();
    }
    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
    SimpleLightbox = new SimpleLightbox('.gallery a').refresh();
  } catch (err) {
    console.log(err);
  }
};

const onSearchFormElSubmit = async e => {
  e.preventDefault();
  try {
    pixabayApi.searchQuery = e.currentTarget.elements.searchQuery.value;
    pixabayApi.page = 1;
    const { data } = await pixabayApi.getPhotoByQuery();
    loadMoreBtnEl.classList.add('is-hidden');
    if (pixabayApi.searchQuery === '') {
      notifyEmptyStr();
      return;
    }

    if (data.totalHits > 0) {
      notifyFindImg(data);
    }

    if (data.totalHits === 0) {
      notifyNoImg();
      return;
    }
    if (totalHitsQuery > data.totalHits) {
      galleryEl.innerHTML = createGalleryCards(data.hits);
      SimpleLightbox = new SimpleLightbox('.gallery a');
      return;
    } else {
      galleryEl.innerHTML = createGalleryCards(data.hits);
      loadMoreBtnEl.classList.remove('is-hidden');
      loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
      SimpleLightbox = new SimpleLightbox('.gallery a');
    }
  } catch (err) {
    console.log(err);
  }
};
searchFormEl.addEventListener('submit', onSearchFormElSubmit);

function notifyNoImg() {
  Notiflix.Notify.failure(`No images found for your request`);
}
function notifyFindImg(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}
function notifyEmptyStr() {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}
function notifyEndResult() {
  Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results.`
  );
}
