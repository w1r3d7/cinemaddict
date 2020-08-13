import {createElement} from '../utils.js';

const createAllFilmsTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`;
};

export default class AllFilms {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createAllFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
