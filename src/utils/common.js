import moment from 'moment';
import {MINUTES_IN_HOUR, UserRank} from '../const.js';

export const humanizeCommentDate = (date) => moment(date).fromNow();

export const humanizeReleaseDate = (releaseDate) => moment(releaseDate).format(`DD MMMM YYYY`);

export const humanizeRunTime = (runTime) => {
  const time = moment.utc().startOf(`day`).add({minutes: runTime});
  if (runTime / MINUTES_IN_HOUR >= 1) {
    return time.format(`H[h] mm[m]`);
  }
  return time.format(`mm[m]`);
};

const FilmsNumber = {
  NOVICE: 1,
  FAN: 10,
  MOVIE_BUFF: 20,
};

export const getUserRank = (filmsViewed) => {
  let rank = ``;

  if (filmsViewed >= FilmsNumber.NOVICE && filmsViewed <= FilmsNumber.FAN) {
    rank = UserRank.NOVICE;
  } else if (filmsViewed > FilmsNumber.FAN && filmsViewed <= FilmsNumber.MOVIE_BUFF) {
    rank = UserRank.FAN;
  } else if (filmsViewed > FilmsNumber.MOVIE_BUFF) {
    rank = UserRank.MOVIE_BUFF;
  }

  return rank;
};

export const generateTemplate = (data, template) => {
  if (!data) {
    return ``;
  }
  return data.map((it) => template(it)).join(``);
};

export const findItemAndRemove = (initialList, deletedId) => {
  let list = initialList.slice();
  const itemIndex = list.findIndex((it) => it.id === deletedId);
  if (itemIndex === -1) {
    throw new Error(`Comments can't delete!`);
  }

  list = [
    ...list.slice(0, itemIndex),
    ...list.slice(itemIndex + 1),
  ];

  return list;
};
