import CrosswordGrid, { Cell } from '../CrosswordGrid';

export default function CrosswordGridExample() {
  const grid: Cell[][] = [
    [
      { letter: 'C', number: 1, isBlack: false },
      { letter: 'A', isBlack: false },
      { letter: 'T', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'D', number: 2, isBlack: false },
      { letter: 'O', isBlack: false },
      { letter: 'G', isBlack: false },
    ],
    [
      { letter: 'O', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'R', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'A', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'O', isBlack: false },
    ],
    [
      { letter: 'D', number: 3, isBlack: false },
      { letter: 'U', isBlack: false },
      { letter: 'C', isBlack: false },
      { letter: 'K', isBlack: false },
      { letter: 'Y', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'A', isBlack: false },
    ],
    [
      { letter: 'E', isBlack: false },
      { letter: '', isBlack: true },
      { letter: 'E', isBlack: false },
      { letter: '', isBlack: true },
      { letter: '', isBlack: true },
      { letter: '', isBlack: true },
      { letter: 'T', isBlack: false },
    ],
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <CrosswordGrid
        grid={grid}
        onComplete={() => console.log('Puzzle completed!')}
      />
    </div>
  );
}
