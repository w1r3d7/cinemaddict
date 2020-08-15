import {RenderPlace} from '../const.js';
import Abstract from '../view/abstract.js';

export const renderTemplate = (container, template, place = RenderPlace.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

export const render = (container, element, place = RenderPlace.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPlace.BEFOREEND:
      container.append(element);
      break;
    case RenderPlace.AFTERBEGIN:
      container.prepend(element);
      break;
  }
};

export const createElement = (template) => {
  const tempContainer = document.createElement(`div`);
  tempContainer.insertAdjacentHTML(RenderPlace.AFTERBEGIN, template);
  return tempContainer.firstChild;
};

export const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};
