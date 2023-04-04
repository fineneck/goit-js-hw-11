import axios from 'axios';

const API_KEY = '34878680-c3ff6e2c0cd5a850aab6b1444';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const url =
      '' +
      BASE_URL +
      '?key=' +
      API_KEY +
      '&q=' +
      this.searchQuery +
      '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=' +
      this.page +
      '';

    return fetch(url)
      .then(response => response.json())
      .then(({ hits }) => {
        this.incrementPage();
        console.log(hits);
        return hits;
      });
  }
  

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
