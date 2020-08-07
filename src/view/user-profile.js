export const createUserProfileTemplate = (moviesWatch) => {
  let rank = ``;

  if (moviesWatch > 0 && moviesWatch < 11) {
    rank = `novice`;
  } else if (moviesWatch > 10 && moviesWatch < 21) {
    rank = `fan`;
  } else if (moviesWatch > 20) {
    rank = `movie buff`;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
