import AllFilmsView from '../view/all-films.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoFilmsView from '../view/no-films.js';
import FilmsSortingView from '../view/films-sorting.js';
import FilmsContainerView from '../view/films-container.js';
import {render, removeComponent} from '../utils/render.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import FilmPresenter from './film.js';
import {filter} from '../utils/filter.js';

const RENDER_FILMS_ON_START = 5;
const RENDER_FILMS_BY_CLICK_LOAD_MORE = 5;

export default class FilmList {
  constructor(container, filmsModel, filterModel) {
    this._siteMainElement = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsShowing = RENDER_FILMS_ON_START;
    this._filmsSortingComponent = null;
    this._filmsListContainer = new FilmsContainerView();
    this._allFilmsComponent = new AllFilmsView();
    this._loadMoreButtonComponent = null;
    this._noFilmsViewComponent = new NoFilmsView();
    this._currentSortType = SortType.BY_DEFAULT;
    this._clickSortingHandler = this._clickSortingHandler.bind(this);
    this._filmPresenter = {};
    this._handleViewAction = this._handleViewAction.bind(this);
    this._openOnlyOneFilmPopup = this._openOnlyOneFilmPopup.bind(this);
    this._handleModelAction = this._handleModelAction.bind(this);

  }

  init() {
    this._renderFilmsBoard();
    this.isDestroy = false;

    this._filmsModel.addObserver(this._handleModelAction);
    this._filterModel.addObserver(this._handleModelAction);
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedTaskCount: true, resetSortType: true});
    removeComponent(this._allFilmsComponent);
    removeComponent(this._filmsListContainer);
    this.isDestroy = true;

    this._filmsModel.deleteObserver(this._handleModelAction);
    this._filterModel.deleteObserver(this._handleModelAction);
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const filterType = this._filterModel.getFilter();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort((filmA, filmB) => filmB.releaseDate - filmA.releaseDate);
      case SortType.BY_RATING:
        return filteredFilms.sort((filmA, filmB) => filmB.rating - filmA.rating);
    }

    return filteredFilms;
  }

  _clearFilmsBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    removeComponent(this._filmsSortingComponent);
    removeComponent(this._noFilmsViewComponent);

    if (this._loadMoreButtonComponent) {
      removeComponent(this._loadMoreButtonComponent);
    }

    if (resetRenderedTaskCount) {
      this._filmsShowing = RENDER_FILMS_ON_START;
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelAction(updateType, update) {
    if (updateType === UpdateType.MINOR && this._filterModel.getFilter() === FilterType.ALL) {
      updateType = UpdateType.PATCH;
    }

    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[update.id].init(update);
        break;
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
    }
  }

  _openOnlyOneFilmPopup() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.closeAllFilmDetails();
    });
  }

  _clickSortingHandler(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsBoard({resetRenderedTaskCount: true});
    this._renderFilmsBoard();
  }

  _renderSorting() {
    if (this._filmsSortingComponent !== null) {
      this._filmsSortingComponent = null;
    }

    this._filmsSortingComponent = new FilmsSortingView(this._currentSortType);
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
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    render(this._allFilmsComponent, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(() => {
      this._clickLoadMoreButtonHandler();
    });
  }

  _renderFilmsBoard() {
    this._renderSorting();
    render(this._siteMainElement, this._filmsListContainer);

    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsListContainer, this._allFilmsComponent);
    this._allFilmsContainerElement = this._filmsListContainer.getElement().querySelector(`.films-list__container`);

    const films = this._getFilms();
    const filmsCountToFirstRender = Math.min(films.length, this._filmsShowing);
    films.slice(0, filmsCountToFirstRender).forEach((film) => {
      this._renderFilm(this._allFilmsContainerElement, film);
    });

    if (films.length > this._filmsShowing) {
      this._renderLoadMoreButton();
    }
  }
}
