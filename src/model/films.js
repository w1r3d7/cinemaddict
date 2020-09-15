import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedFilm, callback) {
    const itemIndex = this._films.findIndex((it) => it.id === updatedFilm.id);
    if (itemIndex === -1) {
      throw new Error(`Films can't update!`);
    }

    this._films = [
      ...this._films.slice(0, itemIndex),
      updatedFilm,
      ...this._films.slice(itemIndex + 1),
    ];

    this._notify(updateType, updatedFilm, callback);
  }

  static adaptToServer(film) {
    const result = Object.assign(
        {},
        film,
        {
          "film_info": {
            "title": film.filmTitle,
            "description": film.description,
            "actors": film.actors,
            "poster": film.pictureUrl,
            "genre": film.genres,
            "director": film.director,
            "writers": film.writers,
            "total_rating": film.rating,
            "runtime": film.runTime,
            "age_rating": film.ageRating,
            "alternative_title": film.alternativeTitle,
            "release": {
              "release_country": film.country,
              "date": film.releaseDate.toISOString(),
            },
          },
          "user_details": {
            "favorite": film.isFavorited,
            "already_watched": film.isViewed,
            "watchlist": film.isInWatchList,
            "watching_date": film.watchingDate.toISOString(),
          }
        }
    );

    delete result.filmTitle;
    delete result.description;
    delete result.actors;
    delete result.pictureUrl;
    delete result.genres;
    delete result.director;
    delete result.writers;
    delete result.rating;
    delete result.runTime;
    delete result.alternativeTitle;
    delete result.country;
    delete result.ageRating;
    delete result.watchingDate;
    delete result.isFavorited;
    delete result.isViewed;
    delete result.isInWatchList;
    delete result.releaseDate;

    return result;
  }

  static adaptToClient(film) {
    const result = Object.assign({},
        film,
        {
          filmTitle: film.film_info.title,
          description: film.film_info.description,
          actors: film.film_info.actors,
          pictureUrl: film.film_info.poster,
          genres: film.film_info.genre,
          director: film.film_info.director,
          writers: film.film_info.writers,
          country: film.film_info.release.release_country,
          rating: film.film_info.total_rating,
          isViewed: film.user_details.already_watched,
          isFavorited: film.user_details.favorite,
          isInWatchList: film.user_details.watchlist,
          releaseDate: new Date(film.film_info.release.date),
          runTime: film.film_info.runtime,
          ageRating: film.film_info.age_rating,
          watchingDate: new Date(film.user_details.watching_date),
          alternativeTitle: film.film_info.alternative_title,
        }
    );

    delete result.film_info;
    delete result.user_details;

    return result;
  }
}
