import { useState, useEffect, useRef } from 'react';

export interface Cell {
  letter: string;
  number?: number;
  isBlack: boolean;
  wordId?: string;
}

export interface GridProps {
  grid: Cell[][];
  onComplete?: () => void;
  disabled?: boolean;
}

export default function CrosswordGrid({ grid, onComplete, disabled = false }: GridProps) {
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [shake, setShake] = useState(false);
  const cellRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    setUserGrid(grid.map(row => row.map(() => '')));
    cellRefs.current = grid.map(row => row.map(() => null));
  }, [grid]);

  useEffect(() => {
    if (userGrid.length === 0) return;
    
    const isComplete = grid.every((row, rowIdx) =>
      row.every((cell, colIdx) => {
        if (cell.isBlack) return true;
        return userGrid[rowIdx][colIdx].toUpperCase() === cell.letter.toUpperCase();
      })
    );

    if (isComplete && onComplete) {
      onComplete();
    }
  }, [userGrid, grid, onComplete]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (disabled || grid[row][col].isBlack) return;

    const newValue = value.toUpperCase().slice(-1);
    const newGrid = [...userGrid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = newValue;
    setUserGrid(newGrid);

    if (newValue && col < grid[0].length - 1 && !grid[row][col + 1].isBlack) {
      cellRefs.current[row][col + 1]?.focus();
    }
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0 && !grid[row - 1][col].isBlack) {
          cellRefs.current[row - 1][col]?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < grid.length - 1 && !grid[row + 1][col].isBlack) {
          cellRefs.current[row + 1][col]?.focus();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0 && !grid[row][col - 1].isBlack) {
          cellRefs.current[row][col - 1]?.focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < grid[0].length - 1 && !grid[row][col + 1].isBlack) {
          cellRefs.current[row][col + 1]?.focus();
        }
        break;
      case 'Backspace':
        if (!userGrid[row][col]) {
          e.preventDefault();
          if (col > 0 && !grid[row][col - 1].isBlack) {
            cellRefs.current[row][col - 1]?.focus();
          }
        }
        break;
    }
  };

  const cellSize = 'w-12 h-12 md:w-14 md:h-14';

  return (
    <div className={`inline-block border-4 border-border rounded-lg overflow-hidden ${shake ? 'animate-shake' : ''}`}>
      <div className="bg-card p-1">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`${cellSize} relative border border-border ${
                  cell.isBlack ? 'bg-foreground' : 'bg-background'
                }`}
              >
                {!cell.isBlack && (
                  <>
                    {cell.number && (
                      <span className="absolute top-0.5 left-0.5 text-xs font-medium text-muted-foreground pointer-events-none">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={el => {
                        if (!cellRefs.current[rowIdx]) cellRefs.current[rowIdx] = [];
                        cellRefs.current[rowIdx][colIdx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={userGrid[rowIdx]?.[colIdx] || ''}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(rowIdx, colIdx, e)}
                      onFocus={() => setSelectedCell({ row: rowIdx, col: colIdx })}
                      disabled={disabled}
                      className={`w-full h-full text-center text-xl md:text-2xl font-semibold font-mono bg-transparent border-0 outline-none focus:ring-4 focus:ring-primary/30 transition-all ${
                        selectedCell?.row === rowIdx && selectedCell?.col === colIdx ? 'ring-4 ring-primary/30' : ''
                      } disabled:opacity-50`}
                      data-testid={`cell-${rowIdx}-${colIdx}`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
