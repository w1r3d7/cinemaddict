import {createElement} from '../utils.js';

const createTopCommentedFilmsTemplate = () => {
  return `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>`;
};


export default class TopCommentedFilms {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createTopCommentedFilmsTemplate();
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
