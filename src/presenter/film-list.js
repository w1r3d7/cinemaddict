import AllFilmsView from '../view/all-films.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoFilmsView from '../view/no-films.js';
import FilmsSortingView from '../view/films-sorting.js';
import FilmsContainerView from '../view/films-container.js';
import {render, removeComponent} from '../utils/render.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import FilmPresenter from './film.js';

const RENDER_FILMS_ON_START = 5;
const RENDER_FILMS_BY_CLICK_LOAD_MORE = 5;

export default class FilmList {
  constructor(container, filmsModel) {
    this._siteMainElement = container;
    this._filmsModel = filmsModel;
    this._filmsSortingComponent = new FilmsSortingView();
    this._filmsListContainer = new FilmsContainerView();
    this._allFilmsComponent = new AllFilmsView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._noFilmsViewComponent = new NoFilmsView();
    this._currentSortType = SortType.BY_DEFAULT;
    this._clickSortingHandler = this._clickSortingHandler.bind(this);
    this._filmPresenter = {};
    this._handleViewAction = this._handleViewAction.bind(this);
    this._openOnlyOneFilmPopup = this._openOnlyOneFilmPopup.bind(this);
    this._handleModelAction = this._handleModelAction.bind(this);
    this._filmsModel.addObserver(this._handleModelAction);
  }

  init() {
    this._renderSorting();
    render(this._siteMainElement, this._filmsListContainer);
    this._renderFilms();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return films.slice().sort((filmA, filmB) => filmB.releaseDate - filmA.releaseDate);
      case SortType.BY_RATING:
        return films.slice().sort((filmA, filmB) => filmB.rating - filmA.rating);
    }

    return films;
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelAction(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[update.id].init(update);
        break;
    }
  }

  _openOnlyOneFilmPopup() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.closeAllFilmDetails();
    });
  }

  _clearAllFilmsContainer() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.destroy();
    });

    this._filmPresenter = {};
  }

  _clickSortingHandler(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearAllFilmsContainer();
    this._renderAllFilmsOnStart();
  }

  _renderSorting() {
    this._filmsSortingComponent.setClickHandler(this._clickSortingHandler);
    render(this._siteMainElement, this._filmsSortingComponent);
  }

  _renderNoFilms() {
    render(this._filmsListContainer, this._noFilmsViewComponent);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._openOnlyOneFilmPopup);
    filmPresenter.init(film);

    this._filmPresenter[film.id] = filmPresenter;
  }

  _clickLoadMoreButtonHandler() {
    const films = this._getFilms();
    if (this._filmsShowing < films.length) {
      films.slice(this._filmsShowing, this._filmsShowing + RENDER_FILMS_BY_CLICK_LOAD_MORE).forEach((it) => {
        this._renderFilm(this._allFilmsContainerElement, it);
      });
      this._filmsShowing += RENDER_FILMS_BY_CLICK_LOAD_MORE;
    }

    if (this._filmsShowing >= films.length) {
      removeComponent(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._allFilmsComponent, this._loadMoreButtonComponent);
    this._filmsShowing = RENDER_FILMS_ON_START;
    this._loadMoreButtonComponent.setClickHandler(() => {
      this._clickLoadMoreButtonHandler();
    });
  }

  _renderAllFilmsOnStart() {
    const films = this._getFilms();
    const filmsCountToFirstRender = Math.min(films.length, RENDER_FILMS_ON_START);
    films.slice(0, filmsCountToFirstRender).forEach((film) => {
      this._renderFilm(this._allFilmsContainerElement, film);
    });

    if (films.length > RENDER_FILMS_ON_START) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilms() {
    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsListContainer, this._allFilmsComponent);
    this._allFilmsContainerElement = this._filmsListContainer.getElement().querySelector(`.films-list__container`);

    this._renderAllFilmsOnStart();
  }
}
