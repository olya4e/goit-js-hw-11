import '../css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabyApi } from './pixabayApi';
import createGalleryCards from '../templates/galleryCards.hbs';
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.js-gallery');

const targetEl = document.querySelector('.target-element');

const pixabayApi = new PixabyApi();
const totalHitsQuery = pixabayApi.page * Number(pixabayApi.photoPerPage);
const simpleLightBox = new SimpleLightbox('.gallery a');

const observerOption = {
  root: null,
  rootMargin: '0px 0px 250px 0px',
  threshold: 1,
};

const observer = new IntersectionObserver(async (entries, observer) => {
  if (entries[0].isIntersecting) {
    try {
      pixabayApi.page += 1;
      const { data } = await pixabayApi.getPhotoByQuery();
      galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
      simpleLightBox.refresh();
      if (totalHitsQuery > data.totalHits) {
        observer.unobserve(targetEl);
      }
    } catch (err) {
      console.log(err);
    }
  }
}, observerOption);

const paintRandomPhotosByPageLoad = async () => {
  try {
    pixabayApi.searchQuery = 'popular';
    const { data } = await pixabayApi.getPhotoByQuery();
    galleryEl.innerHTML = createGalleryCards(data.hits);
    simpleLightBox.refresh();
  } catch (err) {
    console.log(err);
  }
};
paintRandomPhotosByPageLoad();

const onSearchFormElSubmit = async e => {
  e.preventDefault();
  try {
    pixabayApi.searchQuery = e.currentTarget.elements.searchQuery.value;
    pixabayApi.page = 1;
    const { data } = await pixabayApi.getPhotoByQuery();

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
      simpleLightBox.refresh();
      return;
    } else {
      galleryEl.innerHTML = createGalleryCards(data.hits);
      simpleLightBox.refresh();
      observer.observe(targetEl);
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
