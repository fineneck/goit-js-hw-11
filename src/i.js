async function onLoadMore() {
  // Дивлюсь що зараз введено у формі:
  const form = document.querySelector('body .search-form');

  // Якщо запит змінився роблю те саме, що і при submit:
  if (request !== form.elements.searchQuery.value) {
    clearDOM();
    request = form.elements.searchQuery.value;
    page = 1; // скидаю лічильник
    refs.loadMore.style.visibility = 'hidden'; // ховаю кнопку LOAD MORE
  }

  // Якщо запит той самий, то обробляю його і випадок його помилки:
  const data = await requestToPixabayBase(request, page).catch(error => {
    onError(error);
  });

  // Якщо данні є (не undefined):
  if (data) {
    // Додаю розмітку:
    refs.gallery.insertAdjacentHTML('beforeend', markupCards(data));
    refs.loadMore.style.visibility = 'inherit';
    gallerySL.refresh();

    // Якщо картки закінчились:
    if (remainsItems <= 0) {
      itemsIsFinished();
      // refs.loadMore.disabled = true;
      // Notiflix.Notify.info(
      //   "We're sorry, but you've reached the end of search results."
      // );
      // window.removeEventListener('scroll', scrollListener);
      // console.log('window.removeEventListener');
    } else {
      // Плавний скролл лише якщо це НЕ новий запит, тобто сторінка НЕ перша
      if (page > 1) {
        // "плавний" скрол - прокручує на +2 картки по вертикалі
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        // cardHeight - висота картки у пікселях

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    }
  }

  page += 1;

  
}

// ~ Функція для infinity scroll:
function scrollListener(e) {
  // console.log('e', e);
  // document.documentElement.clientWidth;
  // document.documentElement.scrollHeight;
  // document.documentElement.clientTop;
  // Деструктуризація трьох рядків вище:
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight + 1 >= scrollHeight) {
    // +1 тому що браузер іноді дає розмір менше.
    // console.log('I am at bottom');
    if (remainsItems > 0) onLoadMore();
  }
}
// ~ Частина коду, що двічі повторюєтся - вивід повідомлення і знаття слухача
function itemsIsFinished() {
  refs.loadMore.disabled = true;
  Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
  window.removeEventListener('scroll', throttledScrollListener);
  // console.log('window.removeEventListener');
}