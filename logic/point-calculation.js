import { MAP_SIZE } from './constants.js';
import { matrix } from './layout-builder.js';

let points = 0;

const getTileName = (x, y) => {
  const splittedSrc = matrix[x][y].children[0].src.split('/');
  return splittedSrc[splittedSrc.length - 1].split('_')[0];
};

export const calculatePointsFromBorderlands = () => {
  const possibleRows = [];
  const possibleCols = [];

  for (let i = 0; i < MAP_SIZE; i++) {
    const rowTile = getTileName(i, 0);
    const colTile = getTileName(0, i);

    if (rowTile !== 'base') {
      possibleRows.push({ row: i, tile: rowTile });
    }
    if (colTile !== 'base') {
      possibleCols.push({ col: i, tile: colTile });
    }
  }
  console.log(possibleRows, possibleCols);
  const validRows = possibleRows.filter((possibleRow) =>
    matrix[possibleRow.row].every((_, col) => possibleRow.tile === getTileName(possibleRow.row, col))
  );
  const validCols = possibleCols.filter((possibleCol) => {
    let isFullCol = true;

    for (let row = 0; row < MAP_SIZE; row++) {
      if (possibleCol.tile !== getTileName(row, possibleCol.col)) {
        isFullCol = false;
        break;
      }
    }
    return isFullCol;
  });
  console.log(validRows, validCols);
  points += 6 * (validRows.length + validCols.length);
  console.log(points);
};
