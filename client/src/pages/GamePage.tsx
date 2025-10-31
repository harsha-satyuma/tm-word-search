import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Settings } from 'lucide-react';
import WordSearchGrid, { PlacedWord } from '@/components/WordSearchGrid';
import Timer from '@/components/Timer';
import Leaderboard, { LeaderboardEntry } from '@/components/Leaderboard';
import WordList from '@/components/WordList';
import CompletionModal from '@/components/CompletionModal';
import { generateWordSearchGrid } from '@/utils/wordSearchGenerator';
import { Link } from 'wouter';

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Alice', time: 125, rank: 1 },
    { id: '2', name: 'Bob', time: 148, rank: 2 },
    { id: '3', name: 'Carol', time: 162, rank: 3 },
  ]);

  const words = [
    'QUALITY', 'TEAMWORK', 'EXCELLENCE', 'PROCESS', 'IMPROVEMENT',
    'SAFETY', 'STANDARD', 'FEEDBACK', 'AUDIT', 'CUSTOMER'
  ];

  const [gridData, setGridData] = useState<{ grid: string[][]; placedWords: PlacedWord[] }>(
    () => generateWordSearchGrid(words, 14)
  );

  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  useEffect(() => {
    if (foundWords.size === words.length && foundWords.size > 0) {
      handleComplete();
    }
  }, [foundWords]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsCompleted(false);
    setElapsedTime(0);
    setFoundWords(new Set());
    setGridData(generateWordSearchGrid(words, 14));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsCompleted(false);
    setElapsedTime(0);
    setFoundWords(new Set());
    setGridData(generateWordSearchGrid(words, 14));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    setCompletionTime(elapsedTime);
    setShowCompletionModal(true);
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => new Set(Array.from(prev).concat(word)));
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

  const handleTimeUp = () => {
    setIsCompleted(true);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-bold">Word Search Puzzle</h1>
            <div className="flex items-center gap-4">
              <Timer
                duration={180}
                isPaused={!isPlaying || isCompleted}
                onTimeUp={handleTimeUp}
              />
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-admin"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 space-y-8">
            {!isPlaying && !isCompleted && (
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Find all {words.length} words hidden in the grid!
                </p>
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
                  <WordSearchGrid
                    grid={gridData.grid}
                    placedWords={gridData.placedWords}
                    onWordFound={handleWordFound}
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
                    New Puzzle
                  </Button>
                </div>

                <WordList words={words} foundWords={foundWords} />
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
