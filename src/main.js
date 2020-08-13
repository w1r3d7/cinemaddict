import {render} from './utils.js';
import UserProfileView from './view/user-profile.js';
import SiteMenuView from './view/site-menu.js';
import FilmsSortingView from './view/films-sorting.js';
import FilmsContainerView from './view/films-container.js';
import AllFilmsView from './view/all-films.js';
import TopRatedFilmsView from './view/top-rated-films.js';
import TopCommentedFilmsView from './view/top-commented-films.js';
import FilmCardView from './view/film-card.js';
import LoadMoreButtonView from './view/load-more-button.js';
import FilmDetailsView from './view/film-details.js';
import FooterStatiscticsView from './view/footer-statistics.js';
import {generateFilm} from './mock/film.js';
import {createFilters} from './mock/filter.js';

const FILM_COUNTER = 24;
const TOP_FILM_COUNTER = 2;

const RENDER_FILMS_ON_START = 5;
const RENDER_FILMS_BY_CLICK_LOAD_MORE = 5;

const films = Array(FILM_COUNTER).fill(``).map(generateFilm);
const filter = createFilters(films);
const filmsViewed = films.filter((film) => film.isViewed).length;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);


render(siteHeaderElement, new UserProfileView(filmsViewed).getElement());
render(siteMainElement, new SiteMenuView(filter).getElement());
render(siteMainElement, new FilmsSortingView().getElement());
render(siteMainElement, new FilmsContainerView().getElement());

const filmsContainerElement = siteMainElement.querySelector(`.films`);

render(filmsContainerElement, new AllFilmsView().getElement());
const allFilmsElement = filmsContainerElement.querySelector(`.films-list`);
const allFilmsContainerElement = filmsContainerElement.querySelector(`.films-list__container`);

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardView(film).getElement();
  const filmCardPoster = filmCardComponent.querySelector(`.film-card__poster`);
  const filmCardTitle = filmCardComponent.querySelector(`.film-card__title`);
  const filmCardComments = filmCardComponent.querySelector(`.film-card__comments`);

  const checkIfFilmDetailsRenderedOnce = () => {
    const filmDetails = siteBodyElement.querySelector(`.film-details`);
    if (filmDetails) {
      filmDetails.remove();
    }
  };

  const renderFilmDetails = () => {
    const filmDetailsComponent = new FilmDetailsView(film);
    const filmDetailsElement = filmDetailsComponent.getElement();
    const filmDetailsCloseButton = filmDetailsElement.querySelector(`.film-details__close-btn`);

    filmDetailsCloseButton.addEventListener(`click`, () => {
      filmDetailsElement.remove();
      filmDetailsComponent.removeElement();
    });

    render(siteBodyElement, filmDetailsElement);
  };

  const onFilmCardClick = (evt) => {
    evt.preventDefault();
    checkIfFilmDetailsRenderedOnce();
    renderFilmDetails();
  };

  [filmCardPoster, filmCardTitle, filmCardComments].forEach((filmCardItem) => {
    filmCardItem.addEventListener(`click`, onFilmCardClick);
  });

  render(container, filmCardComponent);
};

films.slice(0, RENDER_FILMS_ON_START).forEach((it) => {
  renderFilm(allFilmsContainerElement, it);
});

if (films.length > RENDER_FILMS_ON_START) {
  render(allFilmsElement, new LoadMoreButtonView().getElement());
  const loadMoreButton = document.querySelector(`.films-list__show-more`);
  let filmsShowing = RENDER_FILMS_ON_START;
  loadMoreButton.addEventListener(`click`, () => {
    if (filmsShowing < films.length) {
      films.slice(filmsShowing, filmsShowing + RENDER_FILMS_BY_CLICK_LOAD_MORE).forEach((it) => {
        renderFilm(allFilmsContainerElement, it);
      });
      filmsShowing += RENDER_FILMS_BY_CLICK_LOAD_MORE;
    }

    if (filmsShowing >= films.length) {
      loadMoreButton.remove();
    }
  });
}

render(filmsContainerElement, new TopRatedFilmsView().getElement());
render(filmsContainerElement, new TopCommentedFilmsView().getElement());

const [topRatedFilmsElement, topCommentedFilmsElement] = filmsContainerElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsContainerElement = topRatedFilmsElement.querySelector(`.films-list__container`);
const topCommentedFilmsContainerElement = topCommentedFilmsElement.querySelector(`.films-list__container`);


const filterTopCommented = films.slice().sort((a, b) => b.comments.length - a.comments.length);
filterTopCommented.slice(0, TOP_FILM_COUNTER).forEach((it) => {
  renderFilm(topCommentedFilmsContainerElement, it);
});

const filterTopRated = films.slice().sort((a, b) => b.rating - a.rating);
filterTopRated.slice(0, TOP_FILM_COUNTER).forEach((it) => {
  renderFilm(topRatedFilmsContainerElement, it);
});

render(siteFooterElement, new FooterStatiscticsView(filmsViewed).getElement());
