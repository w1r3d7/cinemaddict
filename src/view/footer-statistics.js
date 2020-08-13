import {createElement} from '../utils.js';

const createFooterStatisticTemplate = (filmsWatch) => {
  return `<section class="footer__statistics">${filmsWatch}</section>`;
};

export default class FooterStatisctics {
  constructor(filmsWatch) {
    this._element = null;
    this._filmsWatch = filmsWatch;
  }

  _getTemplate() {
    return createFooterStatisticTemplate(this._filmsWatch);
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
