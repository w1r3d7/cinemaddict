import AbstractView from "./abstract.js";

const createFooterStatisticTemplate = (filmsWatch) => {
  return `<section class="footer__statistics">${filmsWatch}</section>`;
};

export default class FooterStatisctics extends AbstractView {
  constructor(filmsWatch) {
    super();
    this._filmsWatch = filmsWatch;
  }

  _getTemplate() {
    return createFooterStatisticTemplate(this._filmsWatch);
  }
}
