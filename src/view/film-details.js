import {humanizeDate} from '../utils/common.js';
import SmartView from './smart.js';
import {commentEmojis} from '../const.js';

const generateTemplate = (data, template) => {
  return data.map((it) => template(it)).join(``);
};

const createCommentTemplate = (comment) => {
  const {text, emoji, name, date} = comment;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${name}</span>
                <span class="film-details__comment-day">${humanizeDate(date)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
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

const createEmojiTemplate = (emoji) => {
  return `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;
};

const createEmojiListTemplate = (emoji, chosenEmoji) => {
  const isChecked = emoji === chosenEmoji;
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-${emoji}">
            <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
          </label>`;
};


const createFilmDetailsTemplate = (film) => {
  const {filmTitle, description, comments, pictureUrl, genres, director, writers, country, actors, rating, isViewed, isInWatchList, isFavorited, releaseDate, runTime, ageRating, commentEmoji} = film;

  const genreList = generateTemplate(genres, createGenreTemplate);
  const commentsList = generateTemplate(comments, createCommentTemplate);
  const filmReleaseDate = releaseDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`});
  const emojies = commentEmojis.map((it) => createEmojiListTemplate(it, commentEmoji)).join(``);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${pictureUrl}.jpg" alt="${filmTitle}">
          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmTitle}</h3>
              <p class="film-details__title-original">Original: ${filmTitle}</p>
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
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runTime}</td>
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

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsList}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
          ${commentEmoji ? createEmojiTemplate(commentEmoji) : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojies}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};


export default class FilmDetails extends SmartView {
  constructor(film, sendNewFilmData) {
    super();
    this._data = film;

    this._sendNewFilmData = sendNewFilmData;
    this._closeFilmDetailsClickHandler = this._closeFilmDetailsClickHandler.bind(this);
    this._addToWatchListHandler = this._addToWatchListHandler.bind(this);
    this._addToWatchedListHandler = this._addToWatchedListHandler.bind(this);
    this._addToFavoriteListHandler = this._addToFavoriteListHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._restoreHandlers();
  }

  _parseDataToFilm(data) {
    delete data.commentEmoji;
    return data;
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseFilmDetailsClickHandler(this._callback.click);
  }

  _getTemplate() {
    return createFilmDetailsTemplate(this._data);
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

  _addToWatchListHandler(evt) {
    this.updateData({
      isInWatchList: evt.target.checked,
    }, true);
    this._sendNewFilmData(this._parseDataToFilm(this._data));
  }

  _addToWatchedListHandler(evt) {
    this.updateData({
      isViewed: evt.target.checked,
    }, true);
    this._sendNewFilmData(this._parseDataToFilm(this._data));
  }

  _addToFavoriteListHandler(evt) {
    this.updateData({
      isFavorited: evt.target.checked,
    }, true);
    this._sendNewFilmData(this._parseDataToFilm(this._data));
  }

  _emojiChangeHandler(evt) {
    this.updateData({
      commentEmoji: evt.target.value
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`input[name=watchlist]`)
        .addEventListener(`change`, this._addToWatchListHandler);
    this.getElement().querySelector(`input[name=watched]`)
        .addEventListener(`change`, this._addToWatchedListHandler);
    this.getElement().querySelector(`input[name=favorite]`)
        .addEventListener(`change`, this._addToFavoriteListHandler);
    this.getElement().querySelector(`.film-details__emoji-list`)
        .addEventListener(`change`, this._emojiChangeHandler);
  }
}
