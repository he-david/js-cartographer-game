import { ELEMENTS, PLACING_SIZE } from './constants.js';
import {
  fillCell,
  fillPlacingCell,
  highlightQuests,
  matrix,
  refreshPoints,
  refreshSeason,
  refreshSeasonPoints,
  refreshTime,
} from './layout-builder.js';
import {
  actualQuests,
  calculatePointsFromBorderlands,
  calculatePointsFromEdgeOfTheForest,
  calculatePointsFromEmptySite,
  calculatePointsFromMagiciansValley,
  calculatePointsFromOddNumberedSilos,
  calculatePointsFromRichCountryside,
  calculatePointsFromRowOfHouses,
  calculatePointsFromSleepyValley,
  calculatePointsFromTreeLines,
  calculatePointsFromWateringCanal,
  calculatePointsFromWateringPotatoes,
  calculatePointsFromWealthyTown,
} from './point-calculation.js';

let currentItem;
let previousCoordinates = [];
const seasons = {
  currentSeason: 'spring',
  spring: 7,
  summer: 7,
  fall: 7,
  winter: 7,
};
export const isGameInProgress = [true];

export const getSeasonAndTime = () => {
  return { season: seasons.currentSeason, time: seasons[seasons.currentSeason] };
};

export const getQuestsInSeason = () => {
  const season = getSeasonAndTime().season;
  return actualQuests.filter((quest) => quest.available.includes(season));
};

const refreshItem = (changeLook = false) => {
  for (let i = 0; i < PLACING_SIZE; i++) {
    for (let j = 0; j < PLACING_SIZE; j++) {
      fillPlacingCell(`assets/tiles/base_tile.svg`, i, j);

      if (currentItem.shape[i][j] === 1) {
        fillPlacingCell(`assets/tiles/${currentItem.type}_tile.svg`, i, j);
      }
    }
  }
  if (!changeLook) {
    pointCalculation();
  }
};

export const placeRandomItem = () => {
  currentItem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const timeSpan = document.querySelector('#time');
  timeSpan.innerText = currentItem.time;
  refreshItem();
};

export const rotateItem = () => {
  const shape = currentItem.shape;

  for (let i = 0; i < PLACING_SIZE; i++) {
    for (let j = i; j < PLACING_SIZE; j++) {
      const temp = shape[i][j];
      shape[i][j] = shape[j][i];
      shape[j][i] = temp;
    }
  }
  shape.forEach((row) => row.reverse());
  refreshItem(true);
};

export const mirrorItem = () => {
  currentItem.shape.forEach((row) => row.reverse());
  refreshItem(true);
};

const getTopLeftCoordinates = () => {
  for (let i = 0; i < PLACING_SIZE; i++) {
    for (let j = 0; j < PLACING_SIZE; j++) {
      if (currentItem.shape[i][j] === 1) {
        return [i, j];
      }
    }
  }
};

const cleanupPlaces = () => {
  if (previousCoordinates.length === 0) {
    return;
  }
  previousCoordinates.forEach((coordinate) =>
    matrix[coordinate.row]?.[coordinate.col]?.children[0].classList.remove('cell-error', 'cell-success')
  );
};

const isValidPlace = (event) => {
  const [mapRow, mapCol] = [parseInt(event.target.dataset.row, 10), parseInt(event.target.dataset.col, 10)];
  const [topLeftRow, topLeftCol] = getTopLeftCoordinates();
  const coordinates = [];

  for (let i = topLeftRow; i < PLACING_SIZE; i++) {
    for (let j = 0; j < PLACING_SIZE; j++) {
      if (currentItem.shape[i][j] === 1) {
        coordinates.push({ row: mapRow + (i - topLeftRow), col: mapCol + (j - topLeftCol) });
      }
    }
  }
  const isValid = !coordinates.some(
    (coordinate) =>
      coordinate.row > 10 ||
      coordinate.col < 0 ||
      coordinate.col > 10 ||
      !matrix[coordinate.row][coordinate.col].children[0].src.includes('base_tile')
  );
  return { isValid, coordinates };
};

export const hoveringEventHandler = (event) => {
  cleanupPlaces();
  const { isValid, coordinates } = isValidPlace(event);
  previousCoordinates = coordinates;

  coordinates.forEach((coordinate) =>
    matrix[coordinate.row]?.[coordinate.col]?.children[0].classList.add(isValid ? 'cell-success' : 'cell-error')
  );
};

const pointCalculation = () => {
  calculatePointsFromBorderlands();
  calculatePointsFromEdgeOfTheForest();
  calculatePointsFromSleepyValley();
  calculatePointsFromWateringPotatoes();
  calculatePointsFromTreeLines();
  calculatePointsFromWealthyTown();
  calculatePointsFromWateringCanal();
  calculatePointsFromMagiciansValley();
  calculatePointsFromEmptySite();
  calculatePointsFromRowOfHouses();
  calculatePointsFromOddNumberedSilos();
  calculatePointsFromRichCountryside();
};

const gameEnded = () => {
  pointCalculation();
  refreshPoints(true);
  isGameInProgress[0] = false;
  const gameEndAlert = document.querySelector('#game-end-alert');
  gameEndAlert.classList.remove('visually-hidden');
};

const changeSeason = (remaining) => {
  seasons[seasons.currentSeason] = 0;
  const previousSeason = seasons.currentSeason;
  const seasonNames = Object.getOwnPropertyNames(seasons);
  const index = seasonNames.findIndex((name) => name === seasons.currentSeason);

  if (index !== seasonNames.length - 1) {
    seasons.currentSeason = seasonNames[index + 1];
    seasons[seasons.currentSeason] -= remaining;
  }
  highlightQuests();
  refreshSeason();
  refreshSeasonPoints(previousSeason);

  if (index === seasonNames.length - 1) {
    gameEnded();
  }
};

const itemPlaced = () => {
  if (seasons[seasons.currentSeason] - currentItem.time <= 0) {
    changeSeason(currentItem.time - seasons[seasons.currentSeason]);
  } else {
    seasons[seasons.currentSeason] -= currentItem.time;
  }
  refreshTime();
  placeRandomItem();
};

export const placingEventHandler = (event) => {
  if (!isGameInProgress[0]) {
    return;
  }
  const { isValid, coordinates } = isValidPlace(event);

  if (isValid) {
    coordinates.forEach((coordinate) => fillCell(`assets/tiles/${currentItem.type}_tile.svg`, coordinate.row, coordinate.col));
    cleanupPlaces();
    itemPlaced();
  }
};
