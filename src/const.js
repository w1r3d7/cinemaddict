export const DESCRIPTION_MAX_LETTERS = 139;
export const MINUTES_IN_HOUR = 60;

export const RenderPlace = {
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
};

export const SortType = {
  BY_DEFAULT: `default`,
  BY_DATE: `date`,
  BY_RATING: `rating`,
};

export const commentEmojis = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  CREATE_COMMENT: `CREATE_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
  UPDATE_BOARD: `UPDATE_BOARD`,
  UPDATE_LOCAL_FILM: `UPDATE_LOCAL_FILM`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  JUST_DATA: `JUST_DATA`,
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const StatsFilterType = {
  ALL_TIME: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`,
};

export const FilmsType = {
  ALL: `ALL`,
  RATED: `RATED`,
  COMMENTED: `COMMENTED`
};
