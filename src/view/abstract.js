import {createElement} from "../utils/render.js";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Abstract class cannot be called with operator "new"`);
    }
    this._element = null;
    this._callback = {};
  }

  _getTemplate() {
    throw new Error(`This method not implemented`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
