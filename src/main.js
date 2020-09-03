import {render} from './utils/render.js';
import UserProfileView from './view/user-profile.js';
import FilmsListPresenter from './presenter/film-list.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {generateFilm} from './mock/film.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import StatsPresenter from './presenter/stats.js';

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

const statsPresenter = new StatsPresenter(siteMainElement);

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, filmsListPresenter, statsPresenter);

siteMenuPresenter.init();
filmsListPresenter.init(films);

render(siteFooterElement, new FooterStatisticsView(filmsViewed).getElement());
