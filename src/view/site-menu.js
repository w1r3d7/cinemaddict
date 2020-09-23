import AbstractView from './abstract.js';

const filterButtonActiveClass = `main-navigation__item--active`;
const statsButtonActiveClass = `main-navigation__additional--active`;

const createSiteMenuTemplate = (filters, currentFilter) => {
  const createFilterTemplate = (filterItem) => {
    const {type, name, count} = filterItem;
    const isActiveItem = type === currentFilter ? filterButtonActiveClass : ``;
    return `<a href="#${name}" class="main-navigation__item ${isActiveItem}" data-filter-type=${type} >${name}<span class="main-navigation__item-count">${count}</span></a>`;
  };

  const generatedFiltersTemplate = filters.map(createFilterTemplate).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${generatedFiltersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  setFilterClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, this._filterClickHandler);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, this._statsClickHandler);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    this._callback.click(evt.target.dataset.filterType);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
    this.getElement().querySelector(`.main-navigation__additional`).classList.add(statsButtonActiveClass);
    const activeFilter = this.getElement().querySelector(`.${filterButtonActiveClass}`);
    if (activeFilter) {
      activeFilter.classList.remove(filterButtonActiveClass);
    }
  }
}
