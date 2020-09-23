import Observer from '../utils/observer.js';
import {findItemAndRemove} from '../utils/common.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  createComment(updateType, callback, response) {
    this._comments = response;
    this._notify(updateType, callback, this._comments);
  }

  deleteComment(updateType, callback, deletedCommentId) {
    this._comments = findItemAndRemove(this._comments, deletedCommentId);

    this._notify(updateType, callback);
  }
}
