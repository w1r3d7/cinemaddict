import {getRandomInteger} from '../utils.js';

const Descriptions = {
  MIN: 1,
  MAX: 5,
};

const Comments = {
  MIN: 0,
  MAX: 5,
};

const Genres = {
  MIN: 1,
  MAX: 3,
};

const Writers = {
  MIN: 1,
  MAX: 3,
};

const Actors = {
  MIN: 3,
  MAX: 5,
};

const Rating = {
  MIN: 5,
  MAX: 10,
};

const DateGap = {
  MONTH: 12,
  DAYS: 7,
  HOURS: 10,
  MINUTES: 60,
};

const Runtime = {
  MIN: 90,
  MAX: 120,
};

const MINUTES_IN_HOUR = 60;

export const getRandomfractional = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower)).toFixed(1);
};

const getRandomArrayElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const generateRandomArrayItems = (array, itemsCount) => {
  const itemsSet = new Set();
  let counter = 0;
  while (counter < itemsCount) {
    const setSize = itemsSet.size;
    itemsSet.add(getRandomArrayElement(array));
    if (itemsSet.size > setSize) {
      counter += 1;
    }
  }

  return [...itemsSet];
};

const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

const filmTitles = [
  `Made for each other`,
  `Popeye Meets Sindbad`,
  `Sagebrush Trail`,
  `Santa Claus Conquers the Martians`,
  `The Dance of Life`,
  `The Great Flamarion`,
  `The Man with the Golden Arm`,
];

const filmDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const filmDescriptions = filmDescription.split(/(?=[A-Z])/);

const commentEmojis = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const commentNames = [
  `Jeff Bezos`,
  `Bill Gates`,
  `Elon Musk`,
  `Sergey Brin`,
];

const commentText = [
  `Almost two hours? Seriously?`,
  `Very very old. Meh`,
  `Booooooooooring`,
  `Interesting setting and a good cast`,
];

const generateDateTime = () => {
  const dateTime = new Date();

  const monthsGap = getRandomInteger(0, DateGap.MONTH);
  dateTime.setMonth(dateTime.getMonth() - monthsGap);

  const daysGap = getRandomInteger(0, DateGap.DAYS);
  dateTime.setDate(dateTime.getDate() - daysGap);

  const hoursGap = getRandomInteger(0, DateGap.HOURS);
  dateTime.setHours(dateTime.getHours() - hoursGap);

  const minutesGap = getRandomInteger(0, DateGap.MINUTES);
  dateTime.setMinutes(dateTime.getMinutes() - minutesGap);

  return dateTime;
};

const generateComment = () => {
  return {
    text: getRandomArrayElement(commentText),
    emoji: getRandomArrayElement(commentEmojis),
    name: getRandomArrayElement(commentNames),
    date: generateDateTime(),
  };
};

const genresList = [
  `Drama`,
  `Mystery`,
  `Film-Noir`,
  `Comedy`,
  `Thriller`,
  `Action`,
  `Crime`,
  `Family`,
  `Sci-Fi`,
];

const directorsList = [
  `Woody Allen`,
  `Robert Altman`,
  `Ingmar Bergman`,
  `Tim Burton`,
  `Mel Brooks`,
];

const writersList = [
  `Ingmar Bergman`,
  `Woody Allen`,
  `Billy Wilder`,
  `Jean Luc-Godard`,
  `Charlie Kaufman`,
  `Satyajit Ray`,
  `Stanley Kubrick`,
];

const countriesList = [
  `USA`,
  `USSR`,
  `CHINA`,
  `INDIA`,
];

const actorsList = [
  `Jack Nicholson`,
  `Marlon Brando`,
  `Robert De Niro`,
  `Al Pacino`,
  `Sergey Bezrukov`,
  `Tom Hanks`,
  `Morgan Freeman`,
];

export const generateFilm = () => {
  const filmTitle = getRandomArrayElement(filmTitles);
  const descriptionsCount = getRandomInteger(Descriptions.MIN, Descriptions.MAX);
  const descriptions = generateRandomArrayItems(filmDescriptions, descriptionsCount);
  const commentsCount = getRandomInteger(Comments.MIN, Comments.MAX);
  const comments = Array(commentsCount).fill(``).map(generateComment);
  const pictureUrl = filmTitle.toLowerCase().split(` `).join(`-`);
  const genresCount = getRandomInteger(Genres.MIN, Genres.MAX);
  const genres = generateRandomArrayItems(genresList, genresCount);
  const director = getRandomArrayElement(directorsList);
  const writersCount = getRandomInteger(Writers.MIN, Writers.MAX);
  const writers = generateRandomArrayItems(writersList, writersCount);
  const country = getRandomArrayElement(countriesList);
  const actorsCount = getRandomInteger(Actors.MIN, Actors.MAX);
  const actors = generateRandomArrayItems(actorsList, actorsCount);
  const rating = getRandomfractional(Rating.MIN, Rating.MAX);
  const isViewed = getRandomBoolean();
  const isFavorited = getRandomBoolean();
  const isInWatchList = getRandomBoolean();
  const releaseDate = generateDateTime();
  const runTimeMinutes = getRandomInteger(Runtime.MIN, Runtime.MAX);
  const runTimeHours = Math.floor(runTimeMinutes / MINUTES_IN_HOUR);
  const runTime = `${runTimeHours}h ${runTimeMinutes % MINUTES_IN_HOUR}m`;

  return {
    filmTitle,
    descriptions,
    comments,
    pictureUrl,
    genres,
    director,
    writers,
    country,
    actors,
    rating,
    isViewed,
    isFavorited,
    isInWatchList,
    releaseDate,
    runTime,
  };
};
