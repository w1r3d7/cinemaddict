import {UpdateType, UserAction} from '../const.js';
import {removeComponent, render} from '../utils/render.js';
import CommentView from '../view/comments.js';
import FilmsModel from '../model/films.js';

export default class Comments {
  constructor(container, model, api, handleFilmsViewAction) {
    this._commentsModel = model;
    this._container = container;
    this._api = api;
    this._handleFilmsViewAction = handleFilmsViewAction;
    this._commentsView = null;
    this._handleModelAction = this._handleModelAction.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init(film) {
    if (this._commentsView !== null) {
      this.destroy();
    }

    this._film = film;

    this._commentsModel.addObserver(this._handleModelAction);
    this._comments = this._commentsModel.getComments();
    this._commentsView = new CommentView(this._comments, this._handleViewAction);

    render(this._container, this._commentsView);
  }

  destroy() {
    removeComponent(this._commentsView);
    this._commentsModel.deleteObserver(this._handleModelAction);
  }


  _handleViewAction(userAction, updateType, callback, update) {
    switch (userAction) {
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            this._handleFilmsViewAction(
                UserAction.UPDATE_LOCAL_FILM,
                UpdateType.JUST_DATA,
                Object.assign(
                    {},
                    this._film,
                    {
                      "comments": this._film.comments.filter((commentId) => commentId !== update),
                    }
                ));
            this._commentsModel.deleteComment(updateType, callback, update);
          });
        break;
      case UserAction.CREATE_COMMENT:
        this._api.createComment(this._film, update)
          .then((response) => {
            this._handleFilmsViewAction(UserAction.UPDATE_LOCAL_FILM, UpdateType.JUST_DATA, FilmsModel.adaptToClient(response.movie));
            this._commentsModel.createComment(updateType, callback, response.comments);
          });
        break;
    }
  }

  _handleModelAction(updateType, callback, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        callback(update);
        break;
    }
  }
}
