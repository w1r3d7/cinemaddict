import {DESCRIPTION_MAX_LETTERS} from '../const.js';
import {createElement} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {pictureUrl, filmTitle, description, comments, rating, genres, releaseDate, isViewed, isInWatchList, isFavorited, runTime} = film;

  let descriptionText = description;

  if (descriptionText.length > DESCRIPTION_MAX_LETTERS) {
    descriptionText = descriptionText.slice(0, DESCRIPTION_MAX_LETTERS) + `…`;
  }

  const addActiveClass = (item) => {
    return item ? `film-card__controls-item--active` : ``;
  };

  const [mainGenre] = genres;

  return `<article class="film-card">
          <h3 class="film-card__title">${filmTitle}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${runTime}</span>
            <span class="film-card__genre">${mainGenre}</span>
          </p>
          <img src="./images/posters/${pictureUrl}.jpg" alt="${filmTitle}" class="film-card__poster">
          <p class="film-card__description">${descriptionText}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${addActiveClass(isInWatchList)}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${addActiveClass(isViewed)}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${addActiveClass(isFavorited)}">Mark as favorite</button>
          </form>
        </article>`;
};

export default class FilmCard {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  _getTemplate() {
    return createFilmCardTemplate(this._film);
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
