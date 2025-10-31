import WordSearchGrid, { PlacedWord } from '../WordSearchGrid';

export default function WordSearchGridExample() {
  const grid = [
    ['Q', 'U', 'A', 'L', 'I', 'T', 'Y'],
    ['T', 'E', 'S', 'T', 'I', 'N', 'G'],
    ['P', 'R', 'O', 'C', 'E', 'S', 'S'],
    ['S', 'A', 'F', 'E', 'T', 'Y', 'X'],
    ['A', 'U', 'D', 'I', 'T', 'M', 'Z'],
  ];

  const placedWords: PlacedWord[] = [
    {
      word: 'QUALITY',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 },
        { row: 0, col: 5 },
        { row: 0, col: 6 },
      ],
    },
    {
      word: 'PROCESS',
      positions: [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <WordSearchGrid
        grid={grid}
        placedWords={placedWords}
        onWordFound={(word) => console.log('Found word:', word)}
      />
    </div>
  );
}
