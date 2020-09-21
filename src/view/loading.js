import AbstractView from './abstract.js';


const createLoadingTemplate = () => {
  return `<h2>Loading...</h2>`;
};

export default class Loading extends AbstractView {
  _getTemplate() {
    return createLoadingTemplate();
  }
}
