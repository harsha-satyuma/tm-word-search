export interface PlacedWord {
  word: string;
  positions: { row: number; col: number }[];
}

interface Direction {
  row: number;
  col: number;
}

const DIRECTIONS: Direction[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
];

export function generateWordSearchGrid(
  words: string[],
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

  const placeWord = (word: string): boolean => {
    let attempts = 0;
    const maxAttempts = 500;

    while (attempts < maxAttempts) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

      if (canPlaceWord(word, row, col, direction)) {
        const positions: { row: number; col: number }[] = [];
        
        for (let i = 0; i < word.length; i++) {
          const r = row + direction.row * i;
          const c = col + direction.col * i;
          grid[r][c] = word[i];
          positions.push({ row: r, col: c });
        }

        placedWords.push({ word, positions });
        return true;
      }

      attempts++;
    }

    return false;
  };

  for (const word of words) {
    placeWord(word.toUpperCase());
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
