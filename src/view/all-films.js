import AbstractView from './abstract.js';

const createAllFilmsTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`;
};

export default class AllFilms extends AbstractView {
  _getTemplate() {
    return createAllFilmsTemplate();
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
