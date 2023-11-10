import { MAP_SIZE, MOUNTAIN_COORDINATES, PLACING_SIZE, PLACING_CELL_SIZE } from './constants.js';
import {
  getQuestsInSeason,
  getSeasonAndTime,
  hoveringEventHandler,
  mirrorItem,
  placeRandomItem,
  placingEventHandler,
  rotateItem,
} from './game-logic.js';
import { actualQuests, pointsInPreviousSeason } from './point-calculation.js';

export const TileTypes = {
  FOREST: 'forest',
  BASE: 'base',
  MOUNTAIN: 'mountain',
  PLAINS: 'plains',
  VILLAGE: 'village',
  WATER: 'water',
};
export const matrix = [];
export const placingMatrix = [];

const createSvg = (src, x, y, placing = false) => {
  const svg = document.createElement('img');
  svg.src = src;
  svg.classList.add('mv-100', 'mh-100');

  if (!placing) {
    svg.dataset.row = x;
    svg.dataset.col = y;
    svg.addEventListener('mouseover', hoveringEventHandler);
    svg.addEventListener('click', placingEventHandler);
  }
  return svg;
};

export const fillCell = (src, x, y) => {
  matrix[x][y].replaceChildren(createSvg(src, x, y));
};

export const fillPlacingCell = (src, x, y) => {
  placingMatrix[x][y].replaceChildren(createSvg(src, x, y, true));
};

const appendCell = (src, cell, x, y, placing = false) => {
  cell.appendChild(createSvg(src, x, y, placing));
};

const initializeMountains = () => {
  MOUNTAIN_COORDINATES.forEach((coordinate) => fillCell('assets/tiles/mountain_tile.svg', coordinate.row, coordinate.col));
};

const generateMapLayout = () => {
  const map = document.querySelector('#map');
  const CELL_SIZE = map.clientWidth / 11;

  for (let i = 0; i < MAP_SIZE; i++) {
    const matrixRow = [];
    const row = document.createElement('div');
    row.classList.add('d-flex');

    for (let j = 0; j < MAP_SIZE; j++) {
      const cell = document.createElement('div');
      cell.style.width = CELL_SIZE + 'px';
      cell.style.height = CELL_SIZE + 'px';
      appendCell('assets/tiles/base_tile.svg', cell, i, j);

      row.appendChild(cell);
      matrixRow.push(cell);
    }
    map.appendChild(row);
    matrix.push(matrixRow);
  }
  initializeMountains();
};

const generatePlacingLayout = () => {
  const placingGrid = document.querySelector('#placing-grid');

  for (let i = 0; i < PLACING_SIZE; i++) {
    const matrixRow = [];
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < PLACING_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('col-4');
      cell.style.width = PLACING_CELL_SIZE;
      cell.style.height = PLACING_CELL_SIZE;
      appendCell('assets/tiles/base_tile.svg', cell, i, j, true);

      row.appendChild(cell);
      matrixRow.push(cell);
    }
    placingGrid.appendChild(row);
    placingMatrix.push(matrixRow);
  }
};

const createButtonListeners = () => {
  const rotateButton = document.querySelector('#rotate-button');
  rotateButton.addEventListener('click', rotateItem);

  const mirrorButton = document.querySelector('#mirror-button');
  mirrorButton.addEventListener('click', mirrorItem);
};

export const refreshTime = () => {
  const timeLeft = document.querySelector('#time-left');
  timeLeft.innerText = getSeasonAndTime().time;
};

const getTotalPoints = () => {
  return actualQuests.reduce((sum, quest) => (sum += quest.points), 0);
};

export const refreshSeasonPoints = (previousSeason) => {
  const seasonPointsP = document.querySelector(`.${previousSeason}-points`);
  const totalPoints = getTotalPoints();
  const seasonPoints = totalPoints - pointsInPreviousSeason[0];
  pointsInPreviousSeason[0] = totalPoints;
  seasonPointsP.innerHTML = `${seasonPoints}&nbsp;point${seasonPoints > 1 ? 's' : ''}`;
};

export const refreshPoints = () => {
  const totalPointsSpan = document.querySelector('#total-points');
  const totalPoints = getTotalPoints();
  totalPointsSpan.innerHTML = `${totalPoints}&nbsp;point${totalPoints > 1 ? 's' : ''}`;

  const pointHolders = document.querySelectorAll('.point-holder');
  actualQuests.forEach((quest, i) => {
    pointHolders[i].innerHTML = `(${quest.points}&nbsp;point${quest.points > 1 ? 's' : ''})`;
  });
};

export const highlightQuests = () => {
  const questImages = document.querySelectorAll('.quest-img');
  const seasonalQuests = getQuestsInSeason();

  questImages.forEach((img) => {
    img.classList.add('not-highlighted');

    if (seasonalQuests.some((quest) => img.src.includes(quest.name))) {
      img.classList.remove('not-highlighted');
    }
  });
};

export const setupQuests = () => {
  const questImages = document.querySelectorAll('.quest-img');
  actualQuests.forEach((quest, i) => {
    questImages[i].src = `assets/missions_eng/${quest.name}.png`;
  });
  highlightQuests();
};

export const refreshSeason = () => {
  const currentSeason = document.querySelector('#current-season');
  currentSeason.innerText = getSeasonAndTime().season;
};

const setupSeasons = () => {
  refreshSeason();
};

const generateSidebarLayout = () => {
  generatePlacingLayout();
  createButtonListeners();
  refreshTime();
  refreshPoints();
  setupQuests();
  setupSeasons();
};

generateMapLayout();
generateSidebarLayout();
placeRandomItem();
