import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createFilmsSortingTemplate = () => {
  return `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.BY_DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
          </ul>`;
};

export default class FilmsSorting extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return createFilmsSortingTemplate();
  }

  _clickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.click(evt.target.dataset.sortType);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
