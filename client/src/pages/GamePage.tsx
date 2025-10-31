import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Settings } from 'lucide-react';
import CrosswordGrid, { Cell } from '@/components/CrosswordGrid';
import Timer from '@/components/Timer';
import Leaderboard, { LeaderboardEntry } from '@/components/Leaderboard';
import CluePanel, { Clue } from '@/components/CluePanel';
import CompletionModal from '@/components/CompletionModal';

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Alice', time: 125, rank: 1 },
    { id: '2', name: 'Bob', time: 148, rank: 2 },
    { id: '3', name: 'Carol', time: 162, rank: 3 },
  ]);

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
      { letter: '', isBlack: true },
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

  const clues: Clue[] = [
    { number: 1, text: 'Feline pet', direction: 'across' },
    { number: 2, text: 'Canine companion', direction: 'across' },
    { number: 3, text: 'Waterfowl with webbed feet', direction: 'across' },
    { number: 1, text: 'Programming language', direction: 'down' },
    { number: 2, text: 'Evergreen conifer', direction: 'down' },
  ];

  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsCompleted(false);
    setElapsedTime(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsCompleted(false);
    setElapsedTime(0);
    window.location.reload();
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    setCompletionTime(elapsedTime);
    setShowCompletionModal(true);
  };

  const handleSubmitScore = (name: string) => {
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name,
      time: completionTime,
      rank: leaderboard.length + 1,
    };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => a.time - b.time)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    setLeaderboard(newLeaderboard);
    setShowCompletionModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-bold">Crossword Puzzle</h1>
            <div className="flex items-center gap-4">
              <Timer
                duration={300}
                isPaused={!isPlaying || isCompleted}
                onTick={(remaining) => {}}
              />
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 space-y-8">
            {!isPlaying && !isCompleted && (
              <div className="text-center space-y-4">
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="px-12 py-6 text-lg"
                  data-testid="button-start-game"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Game
                </Button>
              </div>
            )}

            {(isPlaying || isCompleted) && (
              <>
                <div className="flex justify-center">
                  <CrosswordGrid
                    grid={grid}
                    onComplete={handleComplete}
                    disabled={isCompleted}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    data-testid="button-reset"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Puzzle
                  </Button>
                </div>

                <CluePanel clues={clues} />
              </>
            )}
          </div>

          <div className="lg:w-80">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        completionTime={completionTime}
        onSubmit={handleSubmitScore}
      />
    </div>
  );
}
