import {createElement, setFirstLetterToUpperCase} from '../utils.js';

const createSiteMenuTemplate = (filters) => {
  const createFilterTemplate = (filterItem) => {
    const {name, count} = filterItem;
    const isActiveItem = name === `all` ? `main-navigation__item--active` : ``;
    return `<a href="#${name}" class="main-navigation__item ${isActiveItem}">${setFirstLetterToUpperCase(name)} <span class="main-navigation__item-count">${count}</span></a>`;
  };

  const generatedFiltersTemplate = filters.map(createFilterTemplate).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${generatedFiltersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class SiteMenu {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
