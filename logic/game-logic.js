import { ELEMENTS, PLACING_SIZE } from './constants.js';
import { fillPlacingCell } from './layout-builder.js';

const placeRandomItem = () => {
  const item = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const timeSpan = document.querySelector('#time');
  timeSpan.innerText = item.time;

  for (let i = 0; i < PLACING_SIZE; i++) {
    for (let j = 0; j < PLACING_SIZE; j++) {
      if (item.shape[i][j] === 1) {
        fillPlacingCell(`assets/tiles/${item.type}_tile.svg`, i, j);
      }
    }
  }
};

placeRandomItem();
