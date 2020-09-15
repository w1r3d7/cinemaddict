import he from "he";
import {humanizeCommentDate} from "../utils/common";
import {commentEmojis, UpdateType, UserAction} from "../const";
import AbstractView from './abstract.js';
import {createElement, replace} from '../utils/render.js';

const generateTemplate = (data, template) => {
  if (!data) {
    return ``;
  }
  return data.map((it) => template(it)).join(``);
};

const createCommentTemplate = (userComment) => {
  const {
    id,
    author,
    comment,
    date,
    emotion,
  } = userComment;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
                <button class="film-details__comment-delete" data-id="${id}">Delete</button>
              </p>
            </div>
          </li>`;
};

const createEmojiTemplate = (emoji) => {
  return `<div class="film-details__add-emoji-label">
          <img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
          </div>`;
};

const createEmojiListTemplate = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
          <label class="film-details__emoji-label" for="emoji-${emoji}">
            <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
          </label>`;
};

const createEmojiList = (emojiList) => {
  return emojiList.map((it) => createEmojiListTemplate(it)).join(``);
};

const createCommentsTemplate = (comments) => {
  const commentsList = generateTemplate(comments, createCommentTemplate);
  const emojis = createEmojiList(commentEmojis);

  return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

       <ul class="film-details__comments-list">
            ${commentsList}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojis}
          </div>
        </div>
      </section>`;
};

export default class Comments extends AbstractView {
  constructor(comments, handleViewAction) {
    super();
    this._comments = comments;
    this._handleViewAction = handleViewAction;
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._sendCommentKeydownHandler = this._sendCommentKeydownHandler.bind(this);
    this._setInnerHandlers();
    this._updateComments = this._updateComments.bind(this);
  }

  _getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  _emojiChangeHandler(evt) {
    const emoji = evt.target.value;
    this._commentEmoji = emoji;

    const oldEmoji = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const newEmoji = createElement(createEmojiTemplate(emoji));
    replace(oldEmoji, newEmoji);
  }

  _updateComments(response) {
    if (response) {
      this._comments = response;
    }
    const commentsCounter = this.getElement().querySelector(`.film-details__comments-count`);
    commentsCounter.textContent = String(this._comments.length);
    const oldCommentsList = this.getElement().querySelector(`.film-details__comments-list`);
    oldCommentsList.innerHTML = generateTemplate(this._comments, createCommentTemplate);
    this._deleteCommentHandler();
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();

    const commentId = evt.target.dataset.id;

    const commentIndex = this._comments.findIndex((comment) => comment.id === commentId);
    this._comments = [
      ...this._comments.slice(0, commentIndex),
      ...this._comments.slice(commentIndex + 1),
    ];

    this._handleViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        this._updateComments,
        commentId
    );
  }

  _resetCommentForm() {
    const emoji = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emoji.innerHTML = ``;
    const textArea = this.getElement().querySelector(`.film-details__comment-input`);
    textArea.value = ``;
    const emojiList = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiList.innerHTML = createEmojiList(commentEmojis);
  }

  _sendCommentKeydownHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) {
      evt.preventDefault();
      if (!this._commentEmoji) {
        return;
      }
      const comment = {
        comment: String(evt.target.value),
        emotion: String(this._commentEmoji),
        date: new Date().toISOString(),
      };

      this._handleViewAction(
          UserAction.CREATE_COMMENT,
          UpdateType.PATCH,
          this._updateComments,
          comment

      );
      this._resetCommentForm();
    }
  }

  _deleteCommentHandler() {
    const commentsDeleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    if (commentsDeleteButtons) {
      commentsDeleteButtons.forEach((deleteButton) => deleteButton.addEventListener(`click`, this._deleteCommentClickHandler));
    }
  }

  _setInnerHandlers() {
    this._deleteCommentHandler();
    this.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._emojiChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._sendCommentKeydownHandler);
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, (evt) => {
        evt.stopPropagation();
      });
  }
}
