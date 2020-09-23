import {DESCRIPTION_MAX_LETTERS, EMPTY_GENRE} from '../const.js';
import AbstractView from './abstract.js';
import {humanizeRunTime} from '../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {pictureUrl, filmTitle, description, comments, rating, genres, releaseDate, isViewed, isInWatchList, isFavorited, runTime} = film;

  let descriptionText = description;

  if (descriptionText.length > DESCRIPTION_MAX_LETTERS) {
    descriptionText = descriptionText.slice(0, DESCRIPTION_MAX_LETTERS) + `…`;
  }

  const addActiveClass = (item) => {
    return item ? `film-card__controls-item--active` : ``;
  };

  let [mainGenre] = genres;
  if (!mainGenre) {
    mainGenre = EMPTY_GENRE;
  }

  return `<article class="film-card">
          <h3 class="film-card__title">${filmTitle}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${humanizeRunTime(runTime)}</span>
            <span class="film-card__genre">${mainGenre}</span>
          </p>
          <img src="./${pictureUrl}" alt="${filmTitle}" class="film-card__poster">
          <p class="film-card__description">${descriptionText}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${addActiveClass(isInWatchList)}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${addActiveClass(isViewed)}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${addActiveClass(isFavorited)}">Mark as favorite</button>
          </form>
        </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._cardOpenClickHandler = this._cardOpenClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._markAsFavoriteClickHandler = this._markAsFavoriteClickHandler.bind(this);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setCardOpenClickHandler(callback) {
    this._callback.cardOpenClick = callback;
    const filmCardPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmCardTitle = this.getElement().querySelector(`.film-card__title`);
    const filmCardComments = this.getElement().querySelector(`.film-card__comments`);
    [filmCardPoster, filmCardTitle, filmCardComments].forEach((filmCardItem) => {
      filmCardItem.addEventListener(`click`, this._cardOpenClickHandler);
    });
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.clickAddToWatchList = callback;
    const addToWatchListElement = this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`);
    addToWatchListElement.addEventListener(`click`, this._addToWatchListClickHandler);
  }

  setMarkAsFavoriteClickHandler(callback) {
    this._callback.clickMarkAsFavorite = callback;
    const markAsFavoriteElement = this.getElement().querySelector(`.film-card__controls-item--favorite`);
    markAsFavoriteElement.addEventListener(`click`, this._markAsFavoriteClickHandler);
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback.clickMarkAsWatched = callback;
    const markAsWatchedElement = this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`);
    markAsWatchedElement.addEventListener(`click`, this._markAsWatchedClickHandler);
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickAddToWatchList();
  }

  _markAsWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickMarkAsWatched();
  }

  _cardOpenClickHandler(evt) {
    evt.preventDefault();
    this._callback.cardOpenClick();
  }

  _markAsFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickMarkAsFavorite();
  }
}
