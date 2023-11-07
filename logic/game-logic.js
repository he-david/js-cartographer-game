import { ELEMENTS, PLACING_SIZE } from './constants.js';
import { fillCell, fillPlacingCell, matrix } from './layout-builder.js';

let currentItem;
let previousCoordinates = [];

export const placeRandomItem = () => {
  currentItem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const timeSpan = document.querySelector('#time');
  timeSpan.innerText = currentItem.time;

  for (let i = 0; i < PLACING_SIZE; i++) {
    for (let j = 0; j < PLACING_SIZE; j++) {
      if (currentItem.shape[i][j] === 1) {
        fillPlacingCell(`assets/tiles/${currentItem.type}_tile.svg`, i, j);
      }
    }
  }
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

export const placingEventHandler = (event) => {
  const { isValid, coordinates } = isValidPlace(event);

  if (isValid) {
    coordinates.forEach((coordinate) => fillCell(`assets/tiles/${currentItem.type}_tile.svg`, coordinate.row, coordinate.col));
    cleanupPlaces();
  }
};
