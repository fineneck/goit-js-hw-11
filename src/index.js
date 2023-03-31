// import fetch from './js/fetch';
import ImageApiService from './js/image-service';
import imageTpl from './templates/markupHits.hbs';


const imageApiService = new ImageApiService();

const refs = {
  search: document.querySelector('.search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more')
};

refs.search.addEventListener('submit', onSearch);
refs.btnLoad.addEventListener('click', onLoad);


function onSearch(e) {
  e.preventDefault();

  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  imageApiService.resetPage();
  imageApiService.fetchImages().then(appendImageMarkup);
  
};

function onLoad() {
  imageApiService.fetchImages().then(appendImageMarkup);
};

function appendImageMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imageTpl(hits));
}