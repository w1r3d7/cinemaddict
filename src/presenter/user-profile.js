import UserProfileView from '../view/user-profile.js';
import {removeComponent, render} from "../utils/render";
import {FilterType, UpdateType} from "../const";
import {filter} from "../utils/filter";

export default class UserProfile {
  constructor(container, filmsModel) {
    this._userProfileView = null;
    this._container = container;
    this._filmsModel = filmsModel;
    this._handleModelAction = this._handleModelAction.bind(this);
  }

  init() {
    if (this._userProfileView !== null) {
      this._destroy();
    }

    this._filmsModel.addObserver(this._handleModelAction);
    this._userProfileView = new UserProfileView(this._getFilms());
    render(this._container, this._userProfileView);
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    return filter[FilterType.HISTORY](films).length;
  }

  _destroy() {
    removeComponent(this._userProfileView);
    this._filmsModel.deleteObserver(this._handleModelAction);
  }

  _handleModelAction(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this.init(this._getFilms());
        break;
    }
  }
}
