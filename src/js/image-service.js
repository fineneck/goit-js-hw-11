import axios from 'axios';

const API_KEY = '34878680-c3ff6e2c0cd5a850aab6b1444';
const BASE_URL = 'https://pixabay.com/api/';

export default async function fetchImages(query) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );

  totalHits = response.data.totalHits;
  return response.data.hits;
}

// export default class ImageApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   async fetchImg(query) {
//     const response = await axios
//       .get(
//       '' +
//       BASE_URL +
//       '?key=' +
//       API_KEY +
//       '&q=' +
//       this.searchQuery +
//       '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=' +
//       this.page +
//         '');

//         totalHits = response.data.totalHits;
//         return response.data.hits;

//     // return fetch(url)
//     //   .then(response => response.json())
//     //   .then(({ hits }) => {
//     //     this.incrementPage();
//     //     console.log(hits);
//     //     return hits;
//     //   });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
