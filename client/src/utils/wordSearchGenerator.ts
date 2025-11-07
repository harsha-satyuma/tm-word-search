export interface PlacedWord {
  word: string;
  positions: { row: number; col: number }[];
}

export type WordDirection = 
  | 'left-right'
  | 'right-left'
  | 'top-bottom'
  | 'bottom-top'
  | 'diagonal-down-right'
  | 'diagonal-down-left'
  | 'diagonal-up-right'
  | 'diagonal-up-left';

export interface WordWithDirection {
  word: string;
  direction?: WordDirection;
}

interface Direction {
  row: number;
  col: number;
}

const DIRECTION_MAP: Record<WordDirection, Direction> = {
  'left-right': { row: 0, col: 1 },
  'right-left': { row: 0, col: -1 },
  'top-bottom': { row: 1, col: 0 },
  'bottom-top': { row: -1, col: 0 },
  'diagonal-down-right': { row: 1, col: 1 },
  'diagonal-down-left': { row: 1, col: -1 },
  'diagonal-up-right': { row: -1, col: 1 },
  'diagonal-up-left': { row: -1, col: -1 },
};

const ALL_DIRECTIONS: Direction[] = Object.values(DIRECTION_MAP);

export function generateWordSearchGrid(
  words: string[] | WordWithDirection[],
  gridSize: number = 14
): { grid: string[][]; placedWords: PlacedWord[] } {
  const grid: string[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('')
  );
  const placedWords: PlacedWord[] = [];

  const canPlaceWord = (
    word: string,
    row: number,
    col: number,
    direction: Direction
  ): boolean => {
    for (let i = 0; i < word.length; i++) {
      const r = row + direction.row * i;
      const c = col + direction.col * i;

      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (wordStr: string, specifiedDirection?: WordDirection): boolean => {
    let attempts = 0;
    const maxAttempts = 500;

    while (attempts < maxAttempts) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      
      const direction = specifiedDirection 
        ? DIRECTION_MAP[specifiedDirection]
        : ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)];

      if (canPlaceWord(wordStr, row, col, direction)) {
        const positions: { row: number; col: number }[] = [];
        
        for (let i = 0; i < wordStr.length; i++) {
          const r = row + direction.row * i;
          const c = col + direction.col * i;
          grid[r][c] = wordStr[i];
          positions.push({ row: r, col: c });
        }

        placedWords.push({ word: wordStr, positions });
        return true;
      }

      attempts++;
    }

    return false;
  };

  for (const wordItem of words) {
    if (typeof wordItem === 'string') {
      placeWord(wordItem.toUpperCase());
    } else {
      placeWord(wordItem.word.toUpperCase(), wordItem.direction);
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c]) {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}
