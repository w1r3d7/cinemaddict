import {RenderPlace} from '../const.js';
import Abstract from '../view/abstract.js';

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

export const replace = (oldItem, newItem) => {
  if (oldItem instanceof Abstract) {
    oldItem = oldItem.getElement();
  }

  if (newItem instanceof Abstract) {
    newItem = newItem.getElement();
  }

  const parentElement = oldItem.parentElement;

  if (parentElement === null || !oldItem || !newItem) {
    throw new Error(`Can't replace`);
  }

  parentElement.replaceChild(newItem, oldItem);
};

export const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only Components!`);
  }
  component.getElement().remove();
  component.removeElement();
};
