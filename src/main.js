import {render} from './utils/render.js';
import UserProfileView from './view/user-profile.js';
import FilmsListPresenter from './presenter/film-list.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {generateFilm} from './mock/film.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';

const FILM_COUNTER = 22;

const films = Array(FILM_COUNTER).fill(``).map(generateFilm);
const filmsViewed = films.filter((film) => film.isViewed).length;

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);


render(siteHeaderElement, new UserProfileView(filmsViewed));

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
filmsListPresenter.init(films);

render(siteFooterElement, new FooterStatisticsView(filmsViewed).getElement());
