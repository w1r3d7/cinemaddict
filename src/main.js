import {render} from './utils/render.js';
import FilmsListPresenter from './presenter/film-list.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import Api from './api/api.js';
import {UpdateType} from './const.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import UserProfilePresenter from './presenter/user-profile.js';

const URL = `https://12.ecmascript.pages.academy/cinemaddict`;
const AUTH = `Basic soto4ka`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

const api = new Api(URL, AUTH);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel, apiWithProvider);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, filmsListPresenter);

siteMenuPresenter.init();
filmsListPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    userProfilePresenter.init();
    render(siteFooterElement, new FooterStatisticsView(filmsModel.getFilms().length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    userProfilePresenter.init();
    render(siteFooterElement, new FooterStatisticsView(filmsModel.getFilms().length));
  });


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
