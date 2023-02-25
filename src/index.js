import './css/styles.css';
import axios from 'axios';
import ImageService from './js/image-servise';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

const imageService = new ImageService();

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoadMore.addEventListener('click', onLoadMore);
refs.buttonLoadMore.classList.add('is-hidden');

function onFormSubmit(e) {
  e.preventDefault();

  imageService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageService.resetPage();
  imageService.fetchImages().then(handleResponse).catch(onFetchError);
  dataCleaning();
}

async function handleResponse(data) {
  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    dataCleaning();
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  createGallery(data.hits);
  lightbox();
  refs.buttonLoadMore.classList.remove('is-hidden');
}

function onLoadMore(event) {
  imageService
    .fetchImages()
    .then(data => {
      createGallery(data.hits);
      lightbox().refresh();

      let currentPage = data.totalHits / imageService.perPage;
      console.log(currentPage);

      if (imageService.page > currentPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.buttonLoadMore.classList.add('is-hidden');
      }
    })
    .catch(onFetchError);
}

function createGallery(images) {
  console.log(images);

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

function lightbox() {
  return new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

function onFetchError(error) {
  Notiflix.Notify.warning('An error has occurred. Please try again.');
}

function dataCleaning() {
  refs.galleryContainer.innerHTML = '';
  refs.buttonLoadMore.classList.add('is-hidden');
}
