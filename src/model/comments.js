import Observer from '../utils/observer.js';

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
    const itemIndex = this._comments.findIndex((it) => it.id === deletedCommentId);
    if (itemIndex === -1) {
      throw new Error(`Comments can't delete!`);
    }

    this._comments = [
      ...this._comments.slice(0, itemIndex),
      ...this._comments.slice(itemIndex + 1),
    ];

    this._notify(updateType, callback);
  }
}
