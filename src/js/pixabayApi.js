'use strict';
import axios from 'axios';
export class PixabyApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '29924720-00695de3645e8c14b883cf24e';
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.photoPerPage = 40;
  }
  getPhotoByQuery() {
    const serchParams = {
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
      key: this.#API_KEY,
    };
    return axios.get(`${this.#BASE_URL}?`, { params: serchParams });
  }
}
