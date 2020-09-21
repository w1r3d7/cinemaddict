import FilmCardView from '../view/film-card.js';
import {removeComponent, render, replace} from '../utils/render.js';
import FilmDetailsView from '../view/film-details.js';
import {UpdateType, UserAction} from '../const.js';
import CommentsPresenter from './comments.js';
import CommentsModel from '../model/comments.js';
import LoadingView from '../view/loading.js';

const ESCAPE_KEY = `Escape`;

const PopupState = {
  OPENED: `OPENED`,
  CLOSED: `CLOSED`,
};

export default class Film {
  constructor(container, handleViewAction, openOnlyOneFilmPopup, api, siteMainElement) {
    this._filmContainer = container;
    this._api = api;
    this._siteMainElement = siteMainElement;
    this._handleViewAction = handleViewAction;
    this._popupState = PopupState.CLOSED;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._openOnlyOneFilmPopup = openOnlyOneFilmPopup;
    this._filmOpenCardClickHandler = this._filmOpenCardClickHandler.bind(this);
    this.destroy = this.destroy.bind(this);
    this._addToWatchListHandler = this._addToWatchListHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._markAsFavoriteHandler = this._markAsFavoriteHandler.bind(this);
    this.closeAllFilmDetails = this.closeAllFilmDetails.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(this._film, this._handleViewAction);

    this._filmCardComponent.setCardOpenClickHandler(this._filmOpenCardClickHandler);
    this._filmCardComponent.setAddToWatchListClickHandler(this._addToWatchListHandler);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._markAsWatchedHandler);
    this._filmCardComponent.setMarkAsFavoriteClickHandler(this._markAsFavoriteHandler);

    if (prevFilmDetailsComponent === null && prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._popupState === PopupState.CLOSED) {
      replace(prevFilmCardComponent, this._filmCardComponent);
    }

    if (this._popupState === PopupState.OPENED) {
      replace(prevFilmDetailsComponent, this._filmDetailsComponent);
    }

    removeComponent(prevFilmDetailsComponent);
    removeComponent(prevFilmCardComponent);
  }

  destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }

  closeAllFilmDetails() {
    if (this._popupState === PopupState.OPENED) {
      this._closeFilmDetails();
    }
  }

  _addToWatchListHandler() {
    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {isInWatchList: !this._film.isInWatchList})
    );
  }

  _markAsWatchedHandler() {
    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {isViewed: !this._film.isViewed})
    );
  }

  _markAsFavoriteHandler() {
    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {isFavorited: !this._film.isFavorited})
    );
  }

  _filmOpenCardClickHandler() {
    this._renderFilmDetails(this._film);
  }

  _closeFilmDetails() {
    this._popupState = PopupState.CLOSED;
    removeComponent(this._filmDetailsComponent);
    this._handleViewAction(
        UserAction.UPDATE_BOARD
    );
  }

  _renderFilmDetails() {
    this._openOnlyOneFilmPopup();
    this._popupState = PopupState.OPENED;

    const onEscKeyDown = (evt) => {
      if (evt.key === ESCAPE_KEY) {
        this._closeFilmDetails();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);

    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(() => {
      this._closeFilmDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._siteMainElement, this._filmDetailsComponent);
    const formDetailsBottomContainer = this._filmDetailsComponent.getElement().querySelector(`.form-details__bottom-container`);
    const loadingView = new LoadingView();
    render(formDetailsBottomContainer, loadingView);

    const commentsModel = new CommentsModel();
    const commentsPresenter = new CommentsPresenter(formDetailsBottomContainer, commentsModel, this._api, this._handleViewAction);
    this._api.getComments(this._film)
      .then((comments) => commentsModel.setComments(UpdateType.PATCH, comments))
      .then(() => removeComponent(loadingView))
      .then(() => commentsPresenter.init(this._film))
      .catch(() => {
        commentsModel.setComments(UpdateType.PATCH, []);
        removeComponent(loadingView);
        commentsPresenter.init(this._film);
      });
  }
}
