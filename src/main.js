import {render} from './utils/render.js';
import UserProfileView from './view/user-profile.js';
import SiteMenuView from './view/site-menu.js';
import FilmsSortingView from './view/films-sorting.js';
import FilmsContainerView from './view/films-container.js';
import FilmsListPresenter from './presenter/movie-list';
import FooterStatisticsView from './view/footer-statistics.js';
import {generateFilm} from './mock/film.js';
import {createFilters} from './mock/filter.js';

const FILM_COUNTER = 22;

const films = Array(FILM_COUNTER).fill(``).map(generateFilm);
const filter = createFilters(films);
const filmsViewed = films.filter((film) => film.isViewed).length;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);


render(siteHeaderElement, new UserProfileView(filmsViewed));
render(siteMainElement, new SiteMenuView(filter));
render(siteMainElement, new FilmsSortingView());
render(siteMainElement, new FilmsContainerView());
const filmsContainerElement = siteMainElement.querySelector(`.films`);

const filmsListPresenter = new FilmsListPresenter(filmsContainerElement);

filmsListPresenter.init(films);

render(siteFooterElement, new FooterStatisticsView(filmsViewed).getElement());
