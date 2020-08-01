export const Place = {
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
}

export const render = (container, template, place = Place.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};
