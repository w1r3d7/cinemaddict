import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedFilm) {
    const itemIndex = this._films.findIndex((it) => it.id === updatedFilm.id);
    if (itemIndex === -1) {
      throw new Error(`Films can't update!`);
    }

    this._films = [
      ...this._films.slice(0, itemIndex),
      updatedFilm,
      ...this._films.slice(itemIndex + 1),
    ];

    this._notify(updateType, updatedFilm);
  }
}
