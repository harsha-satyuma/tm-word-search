import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Settings } from "lucide-react";
import WordSearchGrid, { PlacedWord } from "@/components/WordSearchGrid";
import Timer from "@/components/Timer";
import PlayerRegistrationModal, {
  PlayerInfo,
} from "@/components/PlayerRegistrationModal";
import { generateWordSearchGrid, type WordWithDirection } from "@/utils/wordSearchGenerator";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function GamePage() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameSubmitted, setGameSubmitted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(10); // Default 10 seconds for testing
  const { toast } = useToast();

  const [wordsWithDirections, setWordsWithDirections] = useState<WordWithDirection[]>([]);
  const words = wordsWithDirections.map(w => w.word);

  const [gridData, setGridData] = useState<{
    grid: string[][];
    placedWords: PlacedWord[];
  }>(() => generateWordSearchGrid(wordsWithDirections, 14));

  // Fetch timer duration from settings and words
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        if (response.ok && data.settings?.timerDuration) {
          setTimerDuration(parseInt(data.settings.timerDuration, 10));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Keep default of 10 seconds
      }
    };

    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words");
        const data = await response.json();
        if (response.ok) {
          const fetchedWords: WordWithDirection[] = data.words.map((w: any) => ({
            word: w.word,
            direction: w.direction,
          }));
          setWordsWithDirections(fetchedWords);
          setGridData(generateWordSearchGrid(fetchedWords, 14));
        }
      } catch (error) {
        console.error("Error fetching words:", error);
        toast({
          title: "Error",
          description: "Failed to fetch words",
          variant: "destructive",
        });
      }
    };

    fetchSettings();
    fetchWords();
  }, []);

  useEffect(() => {
    if (foundWords.size === words.length && foundWords.size > 0 && isPlaying) {
      handleComplete(true);
    }
  }, [foundWords, isPlaying]);

  const handlePlayerRegister = (player: PlayerInfo) => {
    setPlayerInfo(player);
    setShowRegistrationModal(false);
  };

  const handleStart = () => {
    if (!playerInfo) {
      toast({
        title: "Error",
        description: "Please register first",
        variant: "destructive",
      });
      return;
    }
    setIsPlaying(true);
    setIsCompleted(false);
    setElapsedTime(0);
    setFoundWords(new Set());
    setGridData(generateWordSearchGrid(wordsWithDirections, 14));
    setGameSubmitted(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsCompleted(false);
    setElapsedTime(0);
    setFoundWords(new Set());
    setGridData(generateWordSearchGrid(wordsWithDirections, 14));
    setGameSubmitted(false);
  };

  const handleComplete = async (allWordsFound: boolean) => {
    if (isCompleted || gameSubmitted) return;

    setIsCompleted(true);
    setIsPlaying(false);
    setCompletionTime(elapsedTime);

    // Submit game result to backend
    if (playerInfo && !gameSubmitted) {
      try {
        const response = await fetch("/api/game-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerId: playerInfo.id,
            timeTaken: elapsedTime,
            wordsFound: foundWords.size,
            totalWords: words.length,
            completed: allWordsFound,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit result");
        }

        setGameSubmitted(true);
      } catch (error) {
        console.error("Error submitting game result:", error);
        toast({
          title: "Error",
          description: "Failed to submit game result",
          variant: "destructive",
        });
      }
    }
  };

  const handleTimeUp = () => {
    if (!isCompleted) {
      handleComplete(false);
    }
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => new Set(Array.from(prev).concat(word)));
  };

  const getCompletionMessage = () => {
    if (foundWords.size === words.length) {
      return "You found all the words!";
    } else {
      return `You found ${foundWords.size} out of ${words.length} words.`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PlayerRegistrationModal
        isOpen={showRegistrationModal}
        onRegister={handlePlayerRegister}
      />

      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold">Quality - Word Search</h1>
              {playerInfo && (
                <p className="text-sm text-muted-foreground">
                  Player: {playerInfo.name} ({playerInfo.employeeId})
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {isPlaying && !isCompleted && (
                <Timer
                  key={isPlaying ? "playing" : "stopped"}
                  duration={timerDuration}
                  isPaused={!isPlaying || isCompleted}
                  onTimeUp={handleTimeUp}
                  onTick={(remaining) =>
                    setElapsedTime(timerDuration - remaining)
                  }
                />
              )}
              <Link href="/admin/login">
                <Button variant="ghost" size="icon" data-testid="button-admin">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="max-w-4xl w-full space-y-8">
            {!isPlaying && !isCompleted && playerInfo && (
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Find all words hidden in the grid!
                </p>
                <p className="text-sm text-muted-foreground">
                  You have {Math.floor(timerDuration / 60)}:
                  {(timerDuration % 60).toString().padStart(2, "0")} to complete
                  the puzzle.
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

            {isPlaying && !isCompleted && (
              <div className="flex justify-center">
                <WordSearchGrid
                  grid={gridData.grid}
                  placedWords={gridData.placedWords}
                  onWordFound={handleWordFound}
                  disabled={isCompleted}
                />
              </div>
            )}

            {isCompleted && (
              <div className="text-center space-y-6">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {foundWords.size === words.length
                      ? "🎉 Congratulations!"
                      : "⏰ Time's Up!"}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    {getCompletionMessage()}
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Time Taken
                      </p>
                      <p className="text-2xl font-bold">
                        {Math.floor(completionTime / 60)}:
                        {(completionTime % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Words Found
                      </p>
                      <p className="text-2xl font-bold">
                        {foundWords.size} / {words.length}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your result has been saved to the leaderboard.
                  </p>
                </div>

                <Button
                  onClick={() => setShowRegistrationModal(true)}
                  variant="outline"
                  data-testid="button-play-again"
                >
                  Play Again (New Player)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
