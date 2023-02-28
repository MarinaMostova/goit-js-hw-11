import ImageService from './js/image-servise';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
  endPageText: document.querySelector('.end-page'),
  spinner: document.querySelector('.spinner'),
};

const imageService = new ImageService();

const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoadMore.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();
  imageService.resetPage();

  imageService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imageService.query === '') {
    return;
  }

  imageService.fetchImages().then(onfetchGallery).catch(onFetchError);
  dataCleaning();
}

function onfetchGallery(data) {
  if (data.totalHits === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    imageService.resetPage();
    dataCleaning();
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  createGallery(data.hits);
  lightbox.refresh();

  data.totalHits > imageService.perPage
    ? refs.buttonLoadMore.classList.remove('is-hidden')
    : refs.endPageText.classList.remove('is-hidden');
}

function onLoadMore(event) {
  showSpinner();

  imageService.fetchImages().then(data => {
    createGallery(data.hits);
    lightbox.refresh();

    hideSpinner();

    const currentPage = data.totalHits / imageService.perPage;

    if (imageService.page > currentPage) {
      refs.buttonLoadMore.classList.add('is-hidden');
      refs.endPageText.classList.remove('is-hidden');
    }
  });
}

function createGallery(images) {
  const markup = images
    .map(
      image =>
        `<div class="photo-card">
        <a  href="${image.largeImageURL}">   
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="280px" height="180px"/>
          </a>
       <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${image.likes} </p>
        <p class="info-item">
          <b>Views</b>
          ${image.views} </p>
        <p class="info-item">
          <b>Comments</b>
          ${image.comments} </p>
        <p class="info-item">
          <b>Downloads</b> ${image.downloads}</p>
             </div>
    </div>`
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

// function lightbox() {
//   return new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionPosition: 'bottom',
//     captionDelay: 250,
//   });
// }

function showSpinner() {
  refs.spinner.classList.remove('is-hidden');
  refs.buttonLoadMore.classList.add('is-hidden');
}

function hideSpinner() {
  refs.spinner.classList.add('is-hidden');
  refs.buttonLoadMore.classList.remove('is-hidden');
}

function onFetchError(error) {
  Notiflix.Notify.failure('An error has occurred. Please try again.');
  console.error(error);
}

function dataCleaning() {
  refs.galleryContainer.innerHTML = '';
  refs.buttonLoadMore.classList.add('is-hidden');
  refs.endPageText.classList.add('is-hidden');
}
