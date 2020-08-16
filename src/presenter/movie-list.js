import AllFilmsView from '../view/all-films.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import TopCommentedFilmsView from '../view/top-commented-films.js';
import FilmCardView from '../view/film-card.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import FilmDetailsView from '../view/film-details.js';
import NoFilmsView from '../view/no-films.js';
import {render, removeComponent} from '../utils/render.js';

const TOP_FILM_COUNTER = 2;
const ESCAPE_KEY = `Escape`;
const RENDER_FILMS_ON_START = 5;
const RENDER_FILMS_BY_CLICK_LOAD_MORE = 5;

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsListContainer = filmsContainer;
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._topCommentedFilmsComponent = new TopCommentedFilmsView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._noFilmsViewComponent = new NoFilmsView();
  }

  init(films) {
    this._films = films;
    this._renderAllFilms();
  }

  _renderNoFilms() {
    render(this._filmsListContainer, this._noFilmsViewComponent);
  }

  _renderFilmDetails(film) {
    const filmDetailsComponent = new FilmDetailsView(film);
    const filmDetailsElement = filmDetailsComponent.getElement();
    const filmDetailsCommentArea = filmDetailsElement.querySelector(`.film-details__comment-input`);

    filmDetailsCommentArea.addEventListener(`keydown`, (evt) => {
      evt.stopPropagation();
    });

    const closeFilmDetails = () => {
      removeComponent(filmDetailsComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === ESCAPE_KEY) {
        closeFilmDetails();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);

    filmDetailsComponent.setClickHandler(() => {
      closeFilmDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._filmsListContainer, filmDetailsElement);
  }

  _renderFilm(container, film) {
    const filmCardComponent = new FilmCardView(film);

    const checkIfFilmDetailsRenderedOnce = () => {
      const filmDetails = this._filmsListContainer.querySelector(`.film-details`);
      if (filmDetails) {
        filmDetails.remove();
      }
    };

    const onFilmCardClick = () => {
      checkIfFilmDetailsRenderedOnce();
      this._renderFilmDetails(film);
    };

    filmCardComponent.setClickHandler(onFilmCardClick);
    render(container, filmCardComponent);
  }

  _clickLoadMoreButtonHandler() {
    if (this._filmsShowing < this._films.length) {
      this._films.slice(this._filmsShowing, this._filmsShowing + RENDER_FILMS_BY_CLICK_LOAD_MORE).forEach((it) => {
        this._renderFilm(this._allFilmsContainerElement, it);
      });
      this._filmsShowing += RENDER_FILMS_BY_CLICK_LOAD_MORE;
    }

    if (this._filmsShowing >= this._films.length) {
      removeComponent(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListContainer, this._loadMoreButtonComponent);
    this._filmsShowing = RENDER_FILMS_ON_START;
    this._loadMoreButtonComponent.setClickHandler(() => {
      this._clickLoadMoreButtonHandler();
    });
  }

  _renderAllFilms() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsListContainer, this._allFilmsComponent);
    this._allFilmsContainerElement = this._filmsListContainer.querySelector(`.films-list__container`);

    const filmsCountToFirstRender = Math.min(this._films.length, RENDER_FILMS_ON_START);
    this._films.slice(0, filmsCountToFirstRender).forEach((film) => {
      this._renderFilm(this._allFilmsContainerElement, film);
    });

    if (this._films.length > RENDER_FILMS_ON_START) {
      this._renderLoadMoreButton();
    }

    this._renderTopRatedFilms();
    this._renderTopCommentedFilms();
  }

  _renderTopCommentedFilms() {
    render(this._filmsListContainer, this._topCommentedFilmsComponent);
    const topCommentedFilmsContainerElement = this._topCommentedFilmsComponent.getElement().querySelector(`.films-list__container`);
    const filterTopCommented = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);
    filterTopCommented.slice(0, TOP_FILM_COUNTER).forEach((it) => {
      this._renderFilm(topCommentedFilmsContainerElement, it);
    });
  }

  _renderTopRatedFilms() {
    render(this._filmsListContainer, this._topRatedFilmsComponent);
    const topRatedFilmsContainerElement = this._topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    const filterTopRated = this._films.slice().sort((a, b) => b.rating - a.rating);
    filterTopRated.slice(0, TOP_FILM_COUNTER).forEach((it) => {
      this._renderFilm(topRatedFilmsContainerElement, it);
    });
  }
}
