import { MAP_SIZE, MOUNTAIN_COORDINATES, PLACING_SIZE, PLACING_CELL_SIZE } from './constants.js';

const matrix = [];
const placingMatrix = [];

export const getCell = (x, y) => {
  console.log(matrix[x][y].innerText);
  return matrix[x][y];
};

const createSvg = (src) => {
  const svg = document.createElement('img');
  svg.src = src;
  svg.classList.add('mv-100', 'mh-100');
  return svg;
};

export const fillCell = (src, x, y) => {
  matrix[x][y].replaceChildren(createSvg(src));
};

export const fillPlacingCell = (src, x, y) => {
  placingMatrix[x][y].replaceChildren(createSvg(src));
};

const appendCell = (src, cell) => {
  cell.appendChild(createSvg(src));
};

const initializeMountains = () => {
  MOUNTAIN_COORDINATES.forEach((coordinate) => fillCell('assets/tiles/mountain_tile.svg', coordinate.row, coordinate.col));
};

const addClass = (classes, item, condition) => {
  if (condition) {
    classes.push(item);
  }
};

const generateMapLayout = () => {
  const map = document.querySelector('#map');
  const CELL_SIZE = map.clientWidth / 11 - map.clientWidth * 0.0035;

  for (let i = 0; i < MAP_SIZE; i++) {
    const matrixRow = [];
    const row = document.createElement('div');
    row.classList.add('d-flex');

    for (let j = 0; j < MAP_SIZE; j++) {
      const cell = document.createElement('div');
      const classes = [];
      addClass(classes, 'mb-1', i !== MAP_SIZE - 1);
      addClass(classes, 'me-1', j !== MAP_SIZE - 1);
      cell.classList.add(...classes);
      cell.style.width = CELL_SIZE + 'px';
      cell.style.height = CELL_SIZE + 'px';
      appendCell('assets/tiles/base_tile.svg', cell);

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
      const classes = ['col-4'];
      addClass(classes, 'mb-1', i !== PLACING_SIZE - 1);
      addClass(classes, 'me-1', j !== PLACING_SIZE - 1);
      cell.classList.add(...classes);
      cell.style.width = PLACING_CELL_SIZE;
      cell.style.height = PLACING_CELL_SIZE;
      appendCell('assets/tiles/base_tile.svg', cell);

      row.appendChild(cell);
      matrixRow.push(cell);
    }
    placingGrid.appendChild(row);
    placingMatrix.push(matrixRow);
  }
};

const generateSidebarLayout = () => {
  generatePlacingLayout();
};

generateMapLayout();
generateSidebarLayout();
