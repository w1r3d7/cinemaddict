import StatsView from '../view/stats.js';
import {removeComponent, render} from '../utils/render.js';

export default class Stats {
  constructor(statsContainer) {
    this._statsContainer = statsContainer;
    this._statsComponent = new StatsView();
  }

  init() {
    render(this._statsContainer, this._statsComponent);
  }

  destroy() {
    removeComponent(this._statsComponent);
  }
}
