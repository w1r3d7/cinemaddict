import moment from 'moment';
import {MINUTES_IN_HOUR} from '../const.js';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeCommentDate = (date) => {

  return moment(date).fromNow();
};

export const humanizeReleaseDate = (releaseDate) => {
  return moment(releaseDate).format(`DD MMMM YYYY`);
};

export const humanizeRunTime = (runTime) => {
  const time = moment.utc().startOf(`day`).add({minutes: runTime});
  if (runTime / MINUTES_IN_HOUR >= 1) {
    return time.format(`H[h] mm[m]`);
  }

  return time.format(`mm[m]`);
};
