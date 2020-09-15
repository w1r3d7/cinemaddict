import {humanizeRunTime, humanizeReleaseDate} from '../utils/common.js';
import AbstractView from './abstract.js';
import {UpdateType, UserAction} from '../const.js';
import {createElement, replace} from '../utils/render.js';

const Controls = {
  IS_IN_WATCHLIST: `isInWatchList`,
  IS_VIEWED: `isViewed`,
  IS_FAVORITED: `isFavorited`,
};

const generateTemplate = (data, template) => {
  if (!data) {
    return ``;
  }
  return data.map((it) => template(it)).join(``);
};


const createGenreTemplate = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const isManyGenres = (genres) => {
  return genres.length > 1;
};

const setChecked = (item) => {
  return item ? `checked` : ``;
};

const createFilmDetailsControlsTemplate = (isInWatchList, isViewed, isFavorited) => {
  return `<section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${setChecked(isInWatchList)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setChecked(isViewed)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setChecked(isFavorited)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>`;
};

const createFilmDetailsTemplate = (film) => {
  const {
    filmTitle,
    description,
    pictureUrl,
    genres,
    director,
    writers,
    country,
    actors,
    rating,
    isViewed,
    isInWatchList,
    isFavorited,
    releaseDate,
    runTime,
    ageRating,
    alternativeTitle
  } = film;

  const genreList = generateTemplate(genres, createGenreTemplate);
  const actorsList = actors.join(`, `);
  const writersList = writers.join(`, `);
  const filmReleaseDate = humanizeReleaseDate(releaseDate);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${pictureUrl}" alt="${filmTitle}">
          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmTitle}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writersList}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actorsList}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${humanizeRunTime(runTime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${isManyGenres(genres) ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${genreList}
              </td>
            </tr>
          </table>

          <p class="film-details__data-description">
            ${description}
          </p>
        </div>
      </div>
      ${createFilmDetailsControlsTemplate(isInWatchList, isViewed, isFavorited)}
    </div>
    <div class="form-details__bottom-container"></div>
  </form>
</section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(film, handleViewAction) {
    super();
    this._film = film;

    this._handleViewAction = handleViewAction;
    this._closeFilmDetailsClickHandler = this._closeFilmDetailsClickHandler.bind(this);
    this._addToWatchListHandler = this._addToWatchListHandler.bind(this);
    this._addToWatchedListHandler = this._addToWatchedListHandler.bind(this);
    this._addToFavoriteListHandler = this._addToFavoriteListHandler.bind(this);
    this._updateControls = this._updateControls.bind(this);
    this._setInnerHandlers();
  }

  _getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  _closeFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setCloseFilmDetailsClickHandler(callback) {
    this._callback.click = callback;
    const filmDetailsCloseButton = this.getElement().querySelector(`.film-details__close-btn`);
    filmDetailsCloseButton.addEventListener(`click`, this._closeFilmDetailsClickHandler);
  }

  _updateControls() {
    const oldControls = this.getElement().querySelector(`.film-details__controls`);
    const newTemplate = createElement(createFilmDetailsControlsTemplate(this._film.isInWatchList, this._film.isViewed, this._film.isFavorited));
    replace(oldControls, newTemplate);
  }

  _controlHandler(control) {
    const controls = {
      isInWatchList: this._film.isInWatchList,
      isViewed: this._film.isViewed,
      isFavorited: this._film.isFavorited,
      [control]: !this._film[control],
    };

    this._film[control] = !this._film[control];


    const updateControls = () => {
      const oldControls = this.getElement().querySelector(`.film-details__controls`);
      const newTemplate = createElement(createFilmDetailsControlsTemplate(controls.isInWatchList, controls.isViewed, controls.isFavorited));
      replace(oldControls, newTemplate);
      this._controlsHandlers();
    };

    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({}, this._film, {[control]: controls[control]}),
        updateControls
    );
  }

  _addToWatchListHandler(evt) {
    evt.preventDefault();
    this._controlHandler(Controls.IS_IN_WATCHLIST);
  }

  _addToWatchedListHandler(evt) {
    evt.preventDefault();
    this._controlHandler(Controls.IS_VIEWED);
  }

  _addToFavoriteListHandler(evt) {
    evt.preventDefault();
    this._controlHandler(Controls.IS_FAVORITED);
  }

  _controlsHandlers() {
    this.getElement().querySelector(`input[name=watchlist]`)
      .addEventListener(`click`, this._addToWatchListHandler);
    this.getElement().querySelector(`input[name=watched]`)
      .addEventListener(`click`, this._addToWatchedListHandler);
    this.getElement().querySelector(`input[name=favorite]`)
      .addEventListener(`click`, this._addToFavoriteListHandler);
  }

  _setInnerHandlers() {
    this._controlsHandlers();
  }
}
