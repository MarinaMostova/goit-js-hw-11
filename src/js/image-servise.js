import axios from 'axios';

export default class ImageService {
  constructor() {
    this.searchOuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  get query() {
    return this.searchOuery;
  }

  set query(newSearchQeury) {
    this.searchOuery = newSearchQeury;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '33857774-d4152e7dd23a1d1cd9f80d986';
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchOuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );
      this.page += 1;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  resetPage() {
    this.page = 1;
  }
}
