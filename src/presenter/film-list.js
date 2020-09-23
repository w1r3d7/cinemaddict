import AllFilmsView from '../view/all-films.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoFilmsView from '../view/no-films.js';
import FilmsSortingView from '../view/films-sorting.js';
import FilmsContainerView from '../view/films-container.js';
import {render, removeComponent} from '../utils/render.js';
import {SortType, UpdateType, UserAction, FilmsType} from '../const.js';
import FilmPresenter from './film.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import TopCommentedFilmsView from '../view/top-commented-films.js';

const RENDER_FILMS = {
  ON_START: 5,
  BY_CLICK_LOAD_MORE: 5,
  IN_TOP: 2,
};

export default class FilmList {
  constructor(container, filmsModel, filterModel, api) {
    this._siteMainElement = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsShowing = RENDER_FILMS.ON_START;
    this._filmsSortingComponent = null;
    this._filmsListContainer = new FilmsContainerView();
    this._allFilmsComponent = new AllFilmsView();
    this._loadMoreButtonComponent = null;
    this._noFilmsViewComponent = new NoFilmsView();
    this._currentSortType = SortType.BY_DEFAULT;
    this._clickSortingHandler = this._clickSortingHandler.bind(this);
    this._filmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};
    this._topRatedFilmsView = null;
    this._topCommentedFilmsView = null;
    this._handleViewAction = this._handleViewAction.bind(this);
    this._openOnlyOneFilmPopup = this._openOnlyOneFilmPopup.bind(this);
    this._handleModelAction = this._handleModelAction.bind(this);
    this._isLoading = true;
    this._loadingComponent = new LoadingView();
    this._api = api;

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
    removeComponent(this._loadingComponent);
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
    Object
      .values(this._ratedFilmPresenter)
      .forEach((presenter) => presenter.destroy());
    Object
      .values(this._commentedFilmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};

    removeComponent(this._filmsSortingComponent);
    removeComponent(this._noFilmsViewComponent);
    if (this._topRatedFilmsView) {
      removeComponent(this._topRatedFilmsView);
    }
    if (this._topCommentedFilmsView) {
      removeComponent(this._topCommentedFilmsView);
    }


    if (this._loadMoreButtonComponent) {
      removeComponent(this._loadMoreButtonComponent);
    }

    if (resetRenderedTaskCount) {
      this._filmsShowing = RENDER_FILMS.ON_START;
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
  }

  _openOnlyOneFilmPopup() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.closeAllFilmDetails();
    });
  }

  _renderSorting() {
    if (this._filmsSortingComponent !== null) {
      removeComponent(this._filmsSortingComponent);
      this._filmsSortingComponent = null;
    }

    this._filmsSortingComponent = new FilmsSortingView(this._currentSortType);
    this._filmsSortingComponent.setClickHandler(this._clickSortingHandler);
    render(this._siteMainElement, this._filmsSortingComponent);
  }

  _renderLoading() {
    render(this._filmsListContainer, this._loadingComponent);
  }

  _renderNoFilms() {
    render(this._filmsListContainer, this._noFilmsViewComponent);
  }

  _renderFilm(container, film, type) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._openOnlyOneFilmPopup, this._api, this._siteMainElement);
    filmPresenter.init(film);

    switch (type) {
      case FilmsType.ALL:
        this._filmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.RATED:
        this._ratedFilmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.COMMENTED:
        this._commentedFilmPresenter[film.id] = filmPresenter;
        break;
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

  _renderTopRatedFilms() {
    const currentTopFilms = this._filmsModel
                              .getFilms()
                              .slice()
                              .sort((a, b) => b.rating - a.rating)
                              .filter((film) => film.rating > 0)
                              .slice(0, RENDER_FILMS.IN_TOP);
    if (currentTopFilms.length) {
      this._topRatedFilmsView = new TopRatedFilmsView();
      render(this._filmsListContainer, this._topRatedFilmsView);

      currentTopFilms.forEach((film) => {
        this._renderFilm(this._topRatedFilmsView.getFilmsContainer(), film, FilmsType.RATED);
      });
    }
  }

  _renderTopCommentedFilms() {
    const currentTopFilms = this._filmsModel
                                .getFilms()
                                .slice().sort((a, b) => b.comments.length - a.comments.length)
                                .filter((film) => film.comments.length > 0)
                                .slice(0, RENDER_FILMS.IN_TOP);

    if (currentTopFilms.length) {
      this._topCommentedFilmsView = new TopCommentedFilmsView();
      render(this._filmsListContainer, this._topCommentedFilmsView);

      currentTopFilms.forEach((film) => {
        this._renderFilm(this._topCommentedFilmsView.getFilmsContainer(), film, FilmsType.RATED);
      });
    }
  }

  _renderFilmsBoard() {
    this._renderSorting();
    render(this._siteMainElement, this._filmsListContainer);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsListContainer, this._allFilmsComponent);
    this._allFilmsContainerElement = this._allFilmsComponent.getFilmsContainer();
    const films = this._getFilms();
    const filmsCountToFirstRender = Math.min(films.length, this._filmsShowing);
    films.slice(0, filmsCountToFirstRender).forEach((film) => {
      this._renderFilm(this._allFilmsContainerElement, film, FilmsType.ALL);
    });

    if (films.length > this._filmsShowing) {
      this._renderLoadMoreButton();
    }

    this._renderTopRatedFilms();
    this._renderTopCommentedFilms();
  }

  _clickSortingHandler(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsBoard({resetRenderedTaskCount: true});
    this._renderFilmsBoard();
  }

  _clickLoadMoreButtonHandler() {
    const films = this._getFilms();
    if (this._filmsShowing < films.length) {
      films.slice(this._filmsShowing, this._filmsShowing + RENDER_FILMS.BY_CLICK_LOAD_MORE).forEach((it) => {
        this._renderFilm(this._allFilmsContainerElement, it, FilmsType.ALL);
      });
      this._filmsShowing += RENDER_FILMS.BY_CLICK_LOAD_MORE;
    }

    if (this._filmsShowing >= films.length) {
      removeComponent(this._loadMoreButtonComponent);
    }
  }

  _handleViewAction(userAction, updateType, update, callback) {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response, callback));
        break;
      case UserAction.UPDATE_LOCAL_FILM:
        this._filmsModel.updateFilm(updateType, update, callback);
        break;
      case UserAction.UPDATE_BOARD:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
    }
  }

  _handleModelAction(updateType, update, viewCallback) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        removeComponent(this._loadingComponent);
        this._renderFilmsBoard();
        break;
      case UpdateType.PATCH:
        if (viewCallback) {
          viewCallback();
          return;
        }
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
}
