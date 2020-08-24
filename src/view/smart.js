import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }

  updateData(update, updateDataOnly) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (updateDataOnly) {
      return;
    }

    this.updateElement();
    this._restoreHandlers();
  }

  _restoreHandlers() {
    throw new Error(`This method not implemented!`);
  }
}
