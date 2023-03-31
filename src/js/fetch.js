// const options = {
//   headers: {
//     Authorization: '34878680-c3ff6e2c0cd5a850aab6b1444',
//   },
// };

const API_KEY = '34878680-c3ff6e2c0cd5a850aab6b1444';
const BASE_URL = 'https://pixabay.com/api/';

const url = ''+ BASE_URL +'?key='+ API_KEY +'&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1';

fetch(url)
  .then(response => response.json())
  .then(console.log);
