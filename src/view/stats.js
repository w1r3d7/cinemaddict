import SmartView from './smart.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {MINUTES_IN_HOUR, StatsFilterType, EMPTY_GENRE} from '../const.js';
import {getUserRank} from '../utils/common.js';
import {statsFilter} from '../utils/stats-filter.js';

const BAR_HEIGHT = 50;

const totalDurationTemplate = (films) => {
  const totalMinutes = films.reduce((acc, item) => {
    return acc + item.runTime;
  }, 0);

  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  return `<p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>`;
};

const countFilmGenres = (films) => {
  const result = {};
  films.forEach((film) => {
    let [mainGenre] = film.genres;
    if (!mainGenre) {
      mainGenre = EMPTY_GENRE;
    }
    if (!result[mainGenre]) {
      result[mainGenre] = 1;
    } else {
      result[mainGenre] += 1;
    }
  });

  return result;
};

const sortFilmsGenres = (films) => {
  return Object.entries(countFilmGenres(films)).sort(([, a], [, b]) => b - a);
};

const createSortTemplate = (currentSortType) => {
  const generateTemplate = (sortType) => {
    const convertSortTypeToAttribute = sortType.toLowerCase().split(` `).join(`-`);
    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${convertSortTypeToAttribute}" value="${convertSortTypeToAttribute}" ${sortType === currentSortType ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">${sortType}</label>`;
  };
  return Object.values(StatsFilterType).map((it) => generateTemplate(it)).join(``);
};

const renderChart = (element, sortedFilms) => {
  const statisticCtx = element.querySelector(`.statistic__chart`);
  const genres = sortedFilms.map(([it]) => it);
  const genresCount = sortedFilms.map(([, it]) => it);
  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatsTemplate = (filmsViewed, filmsFiltered, topGenre, currentSortType) => {
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(filmsViewed.length)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createSortTemplate(currentSortType)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsFiltered.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${totalDurationTemplate(filmsFiltered)}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(viewedFilms) {
    super();
    this._filmsViewed = viewedFilms;
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._currentStatFilter = StatsFilterType.ALL_TIME;
    this._setChart();
  }

  _getTemplate() {
    let topGenre = ``;
    if (this._filmsViewedSorted.length) {
      [[topGenre]] = this._filmsViewedSorted;
    }
    return createStatsTemplate(this._filmsViewed, this._filteredFilms, topGenre, this._currentStatFilter);
  }

  _restoreHandlers() {
    this._setChart();
    this.setClickFilterHandler();
  }

  setClickFilterHandler() {
    const filters = this.getElement().querySelectorAll(`.statistic__filters-label`);
    filters.forEach((filter) => filter.addEventListener(`click`, this._filterClickHandler));
  }

  _getFilms() {
    this._filteredFilms = statsFilter[this._currentStatFilter](this._filmsViewed);
    this._filmsViewedSorted = sortFilmsGenres(this._filteredFilms);
  }

  _setChart() {
    this._getFilms();
    if (this._filmsViewedSorted.length) {
      renderChart(this.getElement(), this._filmsViewedSorted);
    }
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    if (this._currentStatFilter === evt.target.textContent) {
      return;
    }
    this._currentStatFilter = evt.target.textContent;
    this._getFilms();
    this.updateElement();
    this._restoreHandlers();
  }
}
