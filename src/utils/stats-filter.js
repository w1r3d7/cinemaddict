import {StatsFilterType} from '../const.js';
import moment from 'moment';

export const statsFilter = {
  [StatsFilterType.ALL_TIME]: (films) => films.slice(),
  [StatsFilterType.TODAY]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `day`)),
  [StatsFilterType.WEEK]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `week`)),
  [StatsFilterType.MONTH]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `month`)),
  [StatsFilterType.YEAR]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `year`)),
};
