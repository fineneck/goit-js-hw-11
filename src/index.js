import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import infiniteScroll from 'infinite-scroll';
import ImageApiService from './js/image-service';
import imagesTpl from './templates/markupHits.hbs';
import LoadMoreBtn from './js/load-more-btn';
import { btnUp } from './js/btn-up';

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
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
    return Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }
  // } else {
  //   const totalItems = response.data.totalHits;
  //   Notify.success(`Hooray! We found ${totalItems} images.`);
  // };

  // if (totalItems !== 0 && page === 1) {
  //   Notiflix.Notify.success(`Hooray! We found ${totalItems} images.`);
  // }

  loadMoreBtn.show();
  imageApiService.resetPage();
  clearImageGallery();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  imageApiService.fetchImages().then(hits => {
    appendImageMarkup(hits);
    lightbox.refresh();
    loadMoreBtn.enable();
  });
}

function appendImageMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(hits));
}

function clearImageGallery() {
  refs.gallery.innerHTML = '';
}


