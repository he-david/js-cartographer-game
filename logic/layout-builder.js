import { CELL_SIZE, MAP_SIZE, MOUNTAIN_COORDINATES } from './constants.js';

const matrix = [];

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

const appendCell = (src, cell) => {
  cell.appendChild(createSvg(src));
};

const initializeMountains = () => {
  MOUNTAIN_COORDINATES.forEach((coordinate) => fillCell('assets/tiles/mountain_tile.svg', coordinate.row, coordinate.col));
};

const generateMapLayout = () => {
  const map = document.querySelector('#map');

  for (let i = 0; i < MAP_SIZE; i++) {
    const matrixRow = [];
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < MAP_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('col-1', 'text-center', 'mt-1', 'me-1');
      cell.style.width = CELL_SIZE;
      cell.style.height = CELL_SIZE;
      appendCell('assets/tiles/base_tile.svg', cell);

      row.appendChild(cell);
      matrixRow.push(cell);
    }
    map.appendChild(row);
    matrix.push(matrixRow);
  }
  initializeMountains();
};

const generateSeasonsLayout = () => {};

generateMapLayout();
