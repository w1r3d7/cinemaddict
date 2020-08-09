import {render, Place} from './utils.js';
import {createUserProfileTemplate} from './view/user-profile.js';
import {createMainNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sorting.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createAllFilmsTemplate} from './view/all-films.js';
import {createTopRatedFilmsTemplate} from './view/top-rated-films.js';
import {createTopCommentedFilmsTemplate} from './view/top-commented-films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
import {createFilmDetailsTemplate} from './view/film-details.js';
import {generateFilm} from './mock/film.js';
import {createFooterStatisticTemplate} from './view/footer-statistics.js';
import {createFilters} from './mock/filter.js';

const FILM_COUNTER = 24;
const TOP_FILM_COUNTER = 2;

const RENDER_FILMS_ON_START = 5;
const RENDER_FILMS_BY_CLICK_LOAD_MORE = 5;

const films = Array(FILM_COUNTER).fill(``).map(generateFilm);
const filter = createFilters(films);
const [, , filmsViewed] = filter;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserProfileTemplate(filmsViewed.count));
render(siteMainElement, createMainNavigationTemplate(filter));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsContainerTemplate());

const filmsContainerElement = siteMainElement.querySelector(`.films`);

render(filmsContainerElement, createAllFilmsTemplate());
const allFilmsElement = filmsContainerElement.querySelector(`.films-list`);
const allFilmsContainerElement = filmsContainerElement.querySelector(`.films-list__container`);

films.slice(0, RENDER_FILMS_ON_START).forEach((it) => {
  render(allFilmsContainerElement, createFilmCardTemplate(it));
});

if (films.length > RENDER_FILMS_ON_START) {
  render(allFilmsElement, createLoadMoreButtonTemplate());
  const loadMoreButton = document.querySelector(`.films-list__show-more`);
  let filmsShowing = RENDER_FILMS_ON_START;
  loadMoreButton.addEventListener(`click`, () => {
    if (filmsShowing < films.length) {
      films.slice(filmsShowing, filmsShowing + RENDER_FILMS_BY_CLICK_LOAD_MORE).forEach((it) => {
        render(allFilmsContainerElement, createFilmCardTemplate(it));
      });
      filmsShowing += RENDER_FILMS_BY_CLICK_LOAD_MORE;
    }

    if (filmsShowing >= films.length) {
      loadMoreButton.remove();
    }
  });
}

render(filmsContainerElement, createTopRatedFilmsTemplate());
render(filmsContainerElement, createTopCommentedFilmsTemplate());

const [topRatedFilmsElement, topCommentedFilmsElement] = filmsContainerElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsContainerElement = topRatedFilmsElement.querySelector(`.films-list__container`);
const topCommentedFilmsContainerElement = topCommentedFilmsElement.querySelector(`.films-list__container`);


const filterTopCommented = films.slice().sort((a, b) => b.comments.length - a.comments.length);
filterTopCommented.slice(0, TOP_FILM_COUNTER).forEach((it) => {
  render(topCommentedFilmsContainerElement, createFilmCardTemplate(it));
});

const filterTopRated = films.slice().sort((a, b) => b.rating - a.rating);
filterTopRated.slice(0, TOP_FILM_COUNTER).forEach((it) => {
  render(topRatedFilmsContainerElement, createFilmCardTemplate(it));
});

render(siteFooterElement, createFilmDetailsTemplate(films[0]), Place.AFTEREND);

//Временно
const filmDetails = document.querySelector(`.film-details`);
const filmDetailsCloseButton = filmDetails.querySelector(`.film-details__close-btn`);

filmDetailsCloseButton.addEventListener(`click`, () => {
  filmDetails.remove();
});

///////////////////


render(siteFooterElement, createFooterStatisticTemplate(filmsViewed.count));
