// import fetch from './js/fetch';
import ImageApiService from './js/image-service';
import imageTpl from './templates/markupHits.hbs';
import LoadMoreBtn from './js/load-more-btn';
import { btnUp } from './js/btn-up';

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const refs = {
  search: document.querySelector('.search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  btnUp: document.querySelector('.btn-up'),
};

refs.search.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();

  imageApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  if (imageApiService.searchQuery === '') {
    return alert('Введи что-то');
  }

  loadMoreBtn.show();
  imageApiService.resetPage();
  clearImageGallery();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  imageApiService.fetchImages().then(hits => {
    appendImageMarkup(hits);
    loadMoreBtn.enable();
  });
}

function appendImageMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imageTpl(hits));
}

function clearImageGallery() {
  refs.gallery.innerHTML = '';
}
