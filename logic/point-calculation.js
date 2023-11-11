import { MAP_SIZE, MOUNTAIN_COORDINATES } from './constants.js';
import { TileTypes, matrix, refreshPoints } from './layout-builder.js';

export const pointsInPreviousSeason = [0];
export const QuestTypes = {
  EDGE_OF_THE_FOREST: 'edge-of-the-forest',
  SLEEPY_VALLEY: 'sleepy-valley',
  WATERING_POTATOES: 'watering-potatoes',
  BORDERLANDS: 'borderlands',
  TREE_LINE: 'tree-line',
  WEALTHY_TOWN: 'wealthy-town',
  WATERING_CANAL: 'watering-canal',
  MAGICIANS_VALLEY: 'magicians-valley',
  EMPTY_SITE: 'empty-site',
  ROW_OF_HOUSES: 'row-of-houses',
  ODD_NUMBERED_SILOS: 'odd-numbered-silos',
  RICH_COUNTRYSIDE: 'rich-countryside',
};
export const actualQuests = [
  { name: QuestTypes.EMPTY_SITE, points: 0, available: ['spring', 'winter'] },
  { name: QuestTypes.WEALTHY_TOWN, points: 0, available: ['spring', 'summer'] },
  { name: QuestTypes.WATERING_CANAL, points: 0, available: ['summer', 'fall'] },
  { name: QuestTypes.RICH_COUNTRYSIDE, points: 0, available: ['fall', 'winter'] },
];

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

const addPointsToQuest = (name, gatheredPoints) => {
  const quest = actualQuests.find((quest) => quest.name === name);
  // if (quest.available.includes(getSeasonAndTime().season)) {
  quest.points = gatheredPoints;
  // }
};

const isActiveQuest = (questName) => {
  return actualQuests.some((quest) => quest.name === questName);
};

export const calculatePointsFromBorderlands = () => {
  if (!isActiveQuest(QuestTypes.BORDERLANDS)) {
    return;
  }
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
    matrix[possibleRow.row].every((_, col) => !isSpecificTile(possibleRow.row, col, TileTypes.BASE))
  );
  const validCols = possibleCols.filter((possibleCol) => {
    let isFullCol = true;

    for (let row = 0; row < MAP_SIZE; row++) {
      if (isSpecificTile(row, possibleCol.col, TileTypes.BASE)) {
        isFullCol = false;
        break;
      }
    }
    return isFullCol;
  });
  const gatheredPoints = 6 * (validRows.length + validCols.length);
  addPointsToQuest(QuestTypes.BORDERLANDS, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromEdgeOfTheForest = () => {
  if (!isActiveQuest(QuestTypes.EDGE_OF_THE_FOREST)) {
    return;
  }
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

  addPointsToQuest(QuestTypes.EDGE_OF_THE_FOREST, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromSleepyValley = () => {
  if (!isActiveQuest(QuestTypes.SLEEPY_VALLEY)) {
    return;
  }
  const gatheredPoints =
    4 * matrix.filter((row, i) => 3 === row.reduce((sum, _, j) => (sum += isSpecificTile(i, j, TileTypes.FOREST) ? 1 : 0), 0)).length;
  addPointsToQuest(QuestTypes.SLEEPY_VALLEY, gatheredPoints);
  refreshPoints();
};

const hasSpecificNeighbor = (x, y, tileName) => {
  let has = areValidIndexes(x - 1, y) && isSpecificTile(x - 1, y, tileName);
  has ||= areValidIndexes(x + 1, y) && isSpecificTile(x + 1, y, tileName);
  has ||= areValidIndexes(x, y - 1) && isSpecificTile(x, y - 1, tileName);
  has ||= areValidIndexes(x, y + 1) && isSpecificTile(x, y + 1, tileName);
  return has;
};

export const calculatePointsFromWateringPotatoes = () => {
  if (!isActiveQuest(QuestTypes.WATERING_POTATOES)) {
    return;
  }
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (isSpecificTile(i, j, TileTypes.WATER)) {
        gatheredPoints += hasSpecificNeighbor(i, j, TileTypes.PLAINS) ? 2 : 0;
      }
    }
  }
  addPointsToQuest(QuestTypes.WATERING_POTATOES, gatheredPoints);
  refreshPoints();
};

const hasAllNeighbors = (x, y) => {
  let hasAll = areValidIndexes(x - 1, y) && !isSpecificTile(x - 1, y, TileTypes.BASE);
  hasAll &&= areValidIndexes(x + 1, y) && !isSpecificTile(x + 1, y, TileTypes.BASE);
  hasAll &&= areValidIndexes(x, y - 1) && !isSpecificTile(x, y - 1, TileTypes.BASE);
  hasAll &&= areValidIndexes(x, y + 1) && !isSpecificTile(x, y + 1, TileTypes.BASE);
  return hasAll;
};

export const calculatePointsFromFencedMountains = () => {
  return MOUNTAIN_COORDINATES.reduce((sum, curr) => (sum += hasAllNeighbors(curr.row, curr.col) ? 1 : 0), 0);
};

export const calculatePointsFromTreeLines = () => {
  if (!isActiveQuest(QuestTypes.TREE_LINE)) {
    return;
  }
  let [longestForest, startIndex] = [0, -1];

  for (let col = 0; col < MAP_SIZE; col++) {
    for (let row = 0; row < MAP_SIZE; row++) {
      if (startIndex === -1 && isSpecificTile(row, col, TileTypes.FOREST)) {
        startIndex = row;
      } else if (startIndex !== -1 && (!isSpecificTile(row, col, TileTypes.FOREST) || row === MAP_SIZE - 1)) {
        if (longestForest < row - startIndex) {
          longestForest = row - startIndex;
        }
        startIndex = -1;
      }
    }
  }
  const gatheredPoints = longestForest * 2;
  addPointsToQuest(QuestTypes.TREE_LINE, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromWealthyTown = () => {
  if (!isActiveQuest(QuestTypes.WEALTHY_TOWN)) {
    return;
  }
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (isSpecificTile(i, j, TileTypes.VILLAGE)) {
        const numberOfDifferentNeighbors = Object.values(TileTypes).filter(
          (tile) => tile !== TileTypes.BASE && tile !== TileTypes.MOUNTAIN && hasSpecificNeighbor(i, j, tile)
        ).length;
        gatheredPoints += numberOfDifferentNeighbors >= 3 ? 3 : 0;
      }
    }
  }
  addPointsToQuest(QuestTypes.WEALTHY_TOWN, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromWateringCanal = () => {
  if (!isActiveQuest(QuestTypes.WATERING_CANAL)) {
    return;
  }
  let gatheredPoints = 0;

  for (let col = 0; col < MAP_SIZE; col++) {
    let numberOfPlains = 0;
    let numberOfWaters = 0;

    for (let row = 0; row < MAP_SIZE; row++) {
      numberOfPlains += isSpecificTile(row, col, TileTypes.PLAINS);
      numberOfWaters += isSpecificTile(row, col, TileTypes.WATER);
    }
    gatheredPoints += numberOfPlains > 0 && numberOfPlains === numberOfWaters ? 4 : 0;
    numberOfPlains = 0;
    numberOfWaters = 0;
  }
  addPointsToQuest(QuestTypes.WATERING_CANAL, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromMagiciansValley = () => {
  if (!isActiveQuest(QuestTypes.MAGICIANS_VALLEY)) {
    return;
  }
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (isSpecificTile(i, j, TileTypes.WATER)) {
        gatheredPoints += hasSpecificNeighbor(i, j, TileTypes.MOUNTAIN) ? 3 : 0;
      }
    }
  }
  addPointsToQuest(QuestTypes.MAGICIANS_VALLEY, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromEmptySite = () => {
  if (!isActiveQuest(QuestTypes.EMPTY_SITE)) {
    return;
  }
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (isSpecificTile(i, j, TileTypes.BASE)) {
        gatheredPoints += hasSpecificNeighbor(i, j, TileTypes.VILLAGE) ? 2 : 0;
      }
    }
  }
  addPointsToQuest(QuestTypes.EMPTY_SITE, gatheredPoints);
};

export const calculatePointsFromRowOfHouses = () => {
  if (!isActiveQuest(QuestTypes.ROW_OF_HOUSES)) {
    return;
  }
  let [longestVillage, numberOfLongest, startIndex] = [0, 0, -1];

  for (let row = 0; row < MAP_SIZE; row++) {
    for (let col = 0; col < MAP_SIZE; col++) {
      if (startIndex === -1 && isSpecificTile(row, col, TileTypes.VILLAGE)) {
        startIndex = row;
      } else if (startIndex !== -1 && (!isSpecificTile(row, col, TileTypes.VILLAGE) || row === MAP_SIZE - 1)) {
        if (longestVillage < row - startIndex) {
          numberOfLongest = 1;
          longestVillage = row - startIndex;
        } else if (longestVillage === row - startIndex) {
          numberOfLongest++;
        }
        startIndex = -1;
      }
    }
  }
  const gatheredPoints = longestVillage * 2 * numberOfLongest;
  addPointsToQuest(QuestTypes.ROW_OF_HOUSES, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromOddNumberedSilos = () => {
  if (!isActiveQuest(QuestTypes.ODD_NUMBERED_SILOS)) {
    return;
  }
  let gatheredPoints = 0;
  for (let col = 0; col < MAP_SIZE - 1; col += 2) {
    let wholeCol = true;

    for (let row = 0; row < MAP_SIZE; row++) {
      if (isSpecificTile(row, col, TileTypes.BASE)) {
        wholeCol = false;
        break;
      }
    }
    gatheredPoints += wholeCol ? 10 : 0;
  }
  addPointsToQuest(QuestTypes.ODD_NUMBERED_SILOS, gatheredPoints);
  refreshPoints();
};

export const calculatePointsFromRichCountryside = () => {
  if (!isActiveQuest(QuestTypes.RICH_COUNTRYSIDE)) {
    return;
  }
  let gatheredPoints = 0;

  for (let i = 0; i < MAP_SIZE; i++) {
    const tiles = [];

    for (let j = 0; j < MAP_SIZE; j++) {
      if (!isSpecificTile(i, j, TileTypes.BASE) && !tiles.includes(getTileName(i, j))) {
        tiles.push(getTileName(i, j));
      }
    }
    gatheredPoints += tiles.length >= 5 ? 4 : 0;
  }
  addPointsToQuest(QuestTypes.RICH_COUNTRYSIDE, gatheredPoints);
  refreshPoints();
};
