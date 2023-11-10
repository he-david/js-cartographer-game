import { MAP_SIZE } from './constants.js';
import { getSeasonAndTime } from './game-logic.js';
import { TileTypes, matrix, refreshPoints } from './layout-builder.js';

let points = 0;
export const quests = {
  'edge-of-the-forest': 0,
  'sleepy-valley': 0,
  'watering-potatoes': 0,
  borderlands: 0,
};
export const actualQuests = {
  'edge-of-the-forest': {
    points: 0,
    available: ['spring', 'winter'],
  },
  'sleepy-valley': {
    points: 0,
    available: ['spring', 'summer'],
  },
  'watering-potatoes': {
    points: 0,
    available: ['summer', 'fall'],
  },
  borderlands: {
    points: 0,
    available: ['fall', 'winter'],
  },
};

const getTileName = (x, y) => {
  const splittedSrc = matrix[x][y].children[0].src.split('/');
  return splittedSrc[splittedSrc.length - 1].split('_')[0];
};

const isSpecificTile = (x, y, tileName) => {
  return getTileName(x, y) === tileName;
};

const areValidIndexes = (x, y) => {
  return x >= 0 && x < 11 && y >= 0 && y < 11;
};

export const calculatePointsFromBorderlands = () => {
  // TODO HEDA simplify -> not needed to be identical xD
  const possibleRows = [];
  const possibleCols = [];

  for (let i = 0; i < MAP_SIZE; i++) {
    const rowTile = getTileName(i, 0);
    const colTile = getTileName(0, i);

    if (rowTile !== TileTypes.BASE) {
      possibleRows.push({ row: i, tile: rowTile });
    }
    if (colTile !== TileTypes.BASE) {
      possibleCols.push({ col: i, tile: colTile });
    }
  }
  const validRows = possibleRows.filter((possibleRow) =>
    matrix[possibleRow.row].every((_, col) => isSpecificTile(possibleRow.row, col, possibleRow.tile))
  );
  const validCols = possibleCols.filter((possibleCol) => {
    let isFullCol = true;

    for (let row = 0; row < MAP_SIZE; row++) {
      if (!isSpecificTile(row, possibleCol.col, possibleCol.tile)) {
        isFullCol = false;
        break;
      }
    }
    return isFullCol;
  });
  const gatheredPoints = 6 * (validRows.length + validCols.length);
  points += gatheredPoints;
  actualQuests.borderlands.points = gatheredPoints;
  refreshPoints();
};

export const calculatePointsFromEdgeOfTheForest = () => {
  let gatheredPoints = 0;

  for (let i = 1; i < MAP_SIZE - 1; i++) {
    gatheredPoints += isSpecificTile(0, i, TileTypes.FOREST) ? 1 : 0;
    gatheredPoints += isSpecificTile(i, 0, TileTypes.FOREST) ? 1 : 0;
    gatheredPoints += isSpecificTile(MAP_SIZE - 1, i, TileTypes.FOREST) ? 1 : 0;
    gatheredPoints += isSpecificTile(i, MAP_SIZE - 1, TileTypes.FOREST) ? 1 : 0;
  }
  gatheredPoints += isSpecificTile(0, 0, TileTypes.FOREST) === TileTypes.FOREST ? 1 : 0;
  gatheredPoints += isSpecificTile(MAP_SIZE - 1, MAP_SIZE - 1, TileTypes.FOREST) ? 1 : 0;
  gatheredPoints += isSpecificTile(MAP_SIZE - 1, 0, TileTypes.FOREST) ? 1 : 0;
  gatheredPoints += isSpecificTile(0, MAP_SIZE - 1, TileTypes.FOREST) ? 1 : 0;

  points += gatheredPoints;
  actualQuests['edge-of-the-forest'].points = gatheredPoints;
  refreshPoints();
};

export const calculatePointsFromSleepyValley = () => {
  const gatheredPoints =
    4 * matrix.filter((row, i) => 3 === row.reduce((sum, _, j) => (sum += isSpecificTile(i, j, TileTypes.FOREST)), 0)).length;
  points += gatheredPoints;
  actualQuests['sleepy-valley'].points = gatheredPoints;
  refreshPoints();
};

const checkNeighbors = (x, y, tileName) => {
  let has = areValidIndexes(x - 1, y) && isSpecificTile(x - 1, y, tileName);
  has ||= areValidIndexes(x + 1, y) && isSpecificTile(x + 1, y, tileName);
  has ||= areValidIndexes(x, y - 1) && isSpecificTile(x, y - 1, tileName);
  has ||= areValidIndexes(x, y + 1) && isSpecificTile(x, y + 1, tileName);
  return has;
};

export const calculatePointsFromWateringPotatoes = () => {
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (isSpecificTile(i, j, TileTypes.WATER)) {
        gatheredPoints += checkNeighbors(i, j, TileTypes.PLAINS) ? 2 : 0;
      }
    }
  }
  points += gatheredPoints;
  actualQuests['watering-potatoes'].points = gatheredPoints;
  refreshPoints();
};
