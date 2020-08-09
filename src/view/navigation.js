const setFirstLetterToUpperCase = (string) => {
  const result = String(string).toLowerCase();

  return `${result[0].toUpperCase()}${result.slice(1)}`;
};

export const createMainNavigationTemplate = (filter) => {
  const createFilterTemplate = (filterItem) => {
    const {name, count} = filterItem;
    const isActiveItem = name === `all` ? `main-navigation__item--active` : ``;
    return `<a href="#${name}" class="main-navigation__item ${isActiveItem}">${setFirstLetterToUpperCase(name)} <span class="main-navigation__item-count">${count}</span></a>`;
  };

  const generatedFiltersTemplate = filter.map(createFilterTemplate).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${generatedFiltersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
