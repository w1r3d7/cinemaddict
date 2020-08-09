const filmToFilterMap = {
  all: (films) => films.length,
  watchList: (films) => films.filter((film) => film.isInWatchList).length,
  history: (films) => films.filter((film) => film.isViewed).length,
  favorites: (films) => films.filter((film) => film.isFavorited).length,
};

export const createFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filter, countFilms]) => {
    return {
      name: filter,
      count: countFilms(films),
    };
  });
};
