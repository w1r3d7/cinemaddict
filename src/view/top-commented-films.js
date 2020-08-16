import AbstractView from './abstract.js';

const createTopCommentedFilmsTemplate = () => {
  return `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>`;
};


export default class TopCommentedFilms extends AbstractView {
  _getTemplate() {
    return createTopCommentedFilmsTemplate();
  }
}
