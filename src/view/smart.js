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

  _restoreHandlers() {
    throw new Error(`This method not implemented!`);
  }
}
