import { useState, useEffect } from 'react';

export interface WordSearchGridProps {
  grid: string[][];
  placedWords: PlacedWord[];
  onWordFound?: (word: string) => void;
  disabled?: boolean;
}

export interface PlacedWord {
  word: string;
  positions: { row: number; col: number }[];
}

export default function WordSearchGrid({ grid, placedWords, onWordFound, disabled = false }: WordSearchGridProps) {
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [foundPositions, setFoundPositions] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);

  const posKey = (row: number, col: number) => `${row}-${col}`;

  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || disabled) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    if (lastCell.row === row && lastCell.col === col) return;

    const isAdjacentOrStraight = 
      (lastCell.row === row || lastCell.col === col) ||
      (Math.abs(lastCell.row - row) === Math.abs(lastCell.col - col));

    if (isAdjacentOrStraight) {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting || disabled) return;
    setIsSelecting(false);
    checkWord();
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    if (disabled) return;
    e.preventDefault();
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting || disabled) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const testId = element.getAttribute('data-testid');
    if (!testId?.startsWith('cell-')) return;

    const [, rowStr, colStr] = testId.split('-');
    const row = parseInt(rowStr);
    const col = parseInt(colStr);

    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    if (lastCell.row === row && lastCell.col === col) return;

    const isAdjacentOrStraight = 
      (lastCell.row === row || lastCell.col === col) ||
      (Math.abs(lastCell.row - row) === Math.abs(lastCell.col - col));

    if (isAdjacentOrStraight) {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSelecting || disabled) return;
    e.preventDefault();
    setIsSelecting(false);
    checkWord();
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        checkWord();
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isSelecting) {
        setIsSelecting(false);
        checkWord();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isSelecting, selectedCells]);

  const checkWord = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const matchedWord = placedWords.find(
      (pw) => pw.word === selectedWord || pw.word === reversedWord
    );

    if (matchedWord && onWordFound) {
      const newFoundPositions = new Set(foundPositions);
      matchedWord.positions.forEach(({ row, col }) => {
        newFoundPositions.add(posKey(row, col));
      });
      setFoundPositions(newFoundPositions);
      onWordFound(matchedWord.word);
    }

    setSelectedCells([]);
  };

  const isSelected = (row: number, col: number) =>
    selectedCells.some((cell) => cell.row === row && cell.col === col);

  const isFound = (row: number, col: number) => foundPositions.has(posKey(row, col));

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div 
        className="inline-block select-none touch-none"
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false);
            checkWord();
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="inline-grid gap-0.5 md:gap-1 p-2 md:p-4 bg-card rounded-lg border-2 md:border-4 border-border">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-0.5 md:gap-1">
              {row.map((letter, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 flex items-center justify-center
                    font-semibold text-xs sm:text-sm md:text-base font-mono
                    border border-border rounded cursor-pointer
                    transition-all duration-200
                    ${isFound(rowIdx, colIdx) 
                      ? 'bg-primary text-primary-foreground' 
                      : isSelected(rowIdx, colIdx)
                      ? 'bg-accent text-accent-foreground scale-110'
                      : 'bg-background hover-elevate'
                    }
                  `}
                  onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                  onTouchStart={(e) => handleTouchStart(e, rowIdx, colIdx)}
                  data-testid={`cell-${rowIdx}-${colIdx}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
