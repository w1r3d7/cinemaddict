import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (filmsWatch) => {
  return `<section class="footer__statistics"><p>${filmsWatch} movies inside</p></section>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(filmsWatch) {
    super();
    this._filmsWatch = filmsWatch;
  }

  _getTemplate() {
    return createFooterStatisticsTemplate(this._filmsWatch);
  }
}
