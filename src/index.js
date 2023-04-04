import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import infiniteScroll from 'infinite-scroll';
import throttle from 'lodash.throttle';
// import apiService from './js/image-service';
import imagesTpl from './templates/markupHits.hbs';
import LoadMoreBtn from './js/load-more-btn';
import { btnUp } from './js/btn-up';

const API_KEY = '34878680-c3ff6e2c0cd5a850aab6b1444';
const BASE_URL = 'https://pixabay.com/api/';
const THROTTLE_DELAY = 500;

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

let query = '';
let page;
let totalHits = 0;
let remainsItems = 0;

refs.search.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onButtonClick);
const throttledScrollListener = throttle(scrollListener, THROTTLE_DELAY);
window.addEventListener('scroll', throttledScrollListener);

async function onSearch(e) {
  e.preventDefault();
  clearImageGallery();

  page = 1;
  query = refs.input.value.trim();

  if (query === '') {
    Notify.info(`Please enter a request.`);
    loadMoreBtn.hide();
    refs.search.reset();
    return;
  }

  try {
    const results = await fetchImages(query);
    if (results.length === 0) {
      loadMoreBtn.hide();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    appendImageMarkup(results);
    loadMoreBtn.show();
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.log(error);
  } finally {
    refs.search.reset();
    page += 1;
    loadMoreBtn.disable();
  }
}

async function onButtonClick() {
  try {
    const results = await fetchImages(query);
    const markup = appendImageMarkup(results);
    loadMoreList(markup);
    loadMoreBtn.disable();

    if (page > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    refs.search.reset();
    page += 1;
  }
}

async function fetchImages(query) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );

  totalHits = response.data.totalHits;
  return response.data.hits;
}

function updateNewList(markup) {
  refs.gallery.innerHTML = markup;
  lightbox.refresh();
}

function loadMoreList(markup) {
  appendImageMarkup(markup);
  lightbox.refresh();
  if (page === Math.ceil(totalHits / 40)) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.disable();
  }
}

function appendImageMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(markup));
}

function clearImageGallery() {
  refs.gallery.innerHTML = '';
}

function scrollListener(e) {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight + 1 >= scrollHeight) {
    return onButtonClick(e);
  }
}
