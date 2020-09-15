import {render} from './utils/render.js';
import UserProfileView from './view/user-profile.js';
import FilmsListPresenter from './presenter/film-list.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import Api from './api.js';
import {UpdateType} from './const.js';

const url = `https://12.ecmascript.pages.academy/cinemaddict`;
const auth = `Basic hochu100%!`;

const api = new Api(url, auth);

const filmsModel = new FilmsModel();
api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    const filmsViewed = filmsModel.getFilms().filter((film) => film.isViewed).length;
    render(siteHeaderElement, new UserProfileView(filmsViewed));
    render(siteFooterElement, new FooterStatisticsView(filmsModel.getFilms().length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()));
    render(siteFooterElement, new FooterStatisticsView(filmsModel.getFilms().length));
  });

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel, api);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, filmsListPresenter);

siteMenuPresenter.init();
filmsListPresenter.init();


