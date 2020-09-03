import StatsView from '../view/stats.js';
import {removeComponent, render} from '../utils/render.js';

export default class Stats {
  constructor(statsContainer, filmsModel) {
    this._statsContainer = statsContainer;
    this._statsComponent = null;
    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getFilms();
    this._handleModelAction = this._handleModelAction.bind(this);
  }

  init() {
    this._filmsModel.addObserver(this._handleModelAction);
    const viewedFilms = this._films.filter((film) => film.isViewed);
    this._statsComponent = new StatsView(viewedFilms);
    render(this._statsContainer, this._statsComponent);
    this._statsComponent.setClickFilterHandler();

  }

  _handleModelAction() {
    this.destroy();
    this.init();
  }

  destroy() {
    removeComponent(this._statsComponent);
    this._filmsModel.deleteObserver(this._handleModelAction);
  }
}
