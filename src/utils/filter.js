import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isViewed),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorited),
};
