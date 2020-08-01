import {render, Place} from './utils.js';
import {createUserProfileTemplate} from './view/user-profile.js';
import {createMainNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sorting.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createAllFilmsTemplate} from './view/all-films.js';
import {createTopRatedFilmsTemplate} from './view/top-rated-films.js';
import {createTopCommentedFilmsTemplate} from './view/top-commented-films.js'
import {createFilmCardTemplate} from './view/film-card.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
import {createFilmDetailsTemplate} from './view/film-details.js';

const FILM_COUNTER = 5;
const TOP_FILM_COUNTER = 2;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsContainerTemplate());

const filmsContainerElement = siteMainElement.querySelector(`.films`);

render(filmsContainerElement, createAllFilmsTemplate());
const allFilmsElement = filmsContainerElement.querySelector(`.films-list`);
const allFilmsContainerElement = filmsContainerElement.querySelector(`.films-list__container`);

render(allFilmsElement, createLoadMoreButtonTemplate());
Array(FILM_COUNTER).fill(``).forEach(() => {
  render(allFilmsContainerElement, createFilmCardTemplate());
});

render(filmsContainerElement, createTopRatedFilmsTemplate());
render(filmsContainerElement, createTopCommentedFilmsTemplate());

const [topRatedFilmsElement, topCommentedFilmsElement] = filmsContainerElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsContainerElement = topRatedFilmsElement.querySelector(`.films-list__container`);
const topCommentedFilmsContainerElement = topCommentedFilmsElement.querySelector(`.films-list__container`);

Array(TOP_FILM_COUNTER).fill(``).forEach(() => {
  render(topRatedFilmsContainerElement, createFilmCardTemplate());
  render(topCommentedFilmsContainerElement, createFilmCardTemplate());
});

render(siteFooterElement, createFilmDetailsTemplate(), Place.AFTEREND);
