import StatsView from '../view/stats.js';
import {removeComponent, render} from '../utils/render.js';

export default class Stats {
  constructor(statsContainer, filmsModel) {
    this._statsContainer = statsContainer;
    this._statsComponent = null;
    this._films = filmsModel.getFilms();
  }

  init() {
    const viewedFilms = this._films.filter((film) => film.isViewed);
    this._statsComponent = new StatsView(viewedFilms);
    render(this._statsContainer, this._statsComponent);
    this._statsComponent.setClickFilterHandler();
  }

  destroy() {
    removeComponent(this._statsComponent);
  }
}
