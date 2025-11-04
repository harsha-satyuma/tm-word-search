import { useState, useEffect } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminWordForm, { WordFormData } from "@/components/AdminWordForm";
import WordListCard, { WordData } from "@/components/WordListCard";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

interface LeaderboardEntry {
  id: number;
  employeeId: string;
  name: string;
  timeTaken: number;
  wordsFound: number;
  totalWords: number;
  completed: boolean;
  completedAt: Date;
  rank: number;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<WordData[]>([
    {
      id: "1",
      word: "QUALITY",
      clue: "Standard of excellence",
      direction: "across",
    },
    {
      id: "2",
      word: "TEAMWORK",
      clue: "Collaborative effort",
      direction: "across",
    },
    {
      id: "3",
      word: "EXCELLENCE",
      clue: "Outstanding quality",
      direction: "across",
    },
    { id: "4", word: "PROCESS", clue: "Series of actions", direction: "down" },
    {
      id: "5",
      word: "IMPROVEMENT",
      clue: "Making something better",
      direction: "down",
    },
    {
      id: "6",
      word: "SAFETY",
      clue: "Protection from harm",
      direction: "across",
    },
    { id: "7", word: "STANDARD", clue: "Established norm", direction: "down" },
    {
      id: "8",
      word: "FEEDBACK",
      clue: "Constructive response",
      direction: "across",
    },
    { id: "9", word: "AUDIT", clue: "Official inspection", direction: "down" },
    {
      id: "10",
      word: "CUSTOMER",
      clue: "Person who buys",
      direction: "across",
    },
  ]);
  const [editingWord, setEditingWord] = useState<WordData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Check if admin is logged in
    const adminData = sessionStorage.getItem("admin");
    if (!adminData) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin panel",
        variant: "destructive",
      });
      setLocation("/admin/login");
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      if (response.ok) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leaderboard",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    setLocation("/");
  };

  const handleAddWord = (data: WordFormData) => {
    const newWord: WordData = {
      id: Date.now().toString(),
      ...data,
    };
    setWords([...words, newWord]);
    console.log("Word added:", newWord);
  };

  const handleEditWord = (data: WordFormData) => {
    if (!editingWord) return;
    setWords(
      words.map((w) => (w.id === editingWord.id ? { ...w, ...data } : w)),
    );
    setEditingWord(null);
    console.log("Word updated:", data);
  };

  const handleDeleteWord = (id: string) => {
    setWords(words.filter((w) => w.id !== id));
    console.log("Word deleted:", id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-back-to-game"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <p
                  className="text-sm text-muted-foreground"
                  data-testid="text-word-count"
                >
                  {words.length} words in database
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <AdminWordForm
                onSubmit={editingWord ? handleEditWord : handleAddWord}
                initialData={editingWord || undefined}
                isEditing={!!editingWord}
              />
              {editingWord && (
                <Button
                  variant="outline"
                  onClick={() => setEditingWord(null)}
                  className="w-full mt-4"
                  data-testid="button-cancel-edit"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Word List</h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {words.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      No words added yet. Add your first word to get started!
                    </p>
                  ) : (
                    words.map((word) => (
                      <WordListCard
                        key={word.id}
                        word={word}
                        onEdit={setEditingWord}
                        onDelete={handleDeleteWord}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h2 className="text-2xl font-semibold">Leaderboard</h2>
                <p className="text-sm text-muted-foreground">
                  Top performers who completed the puzzle
                </p>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      No results yet. Be patient!
                    </p>
                  ) : (
                    leaderboard.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-3 rounded-md bg-accent/50"
                        data-testid={`leaderboard-entry-${entry.id}`}
                      >
                        <div className="flex-shrink-0 w-8 text-center">
                          <span className="font-bold text-lg">
                            #{entry.rank}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {entry.employeeId}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-lg font-semibold font-mono">
                            {formatTime(entry.timeTaken)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entry.wordsFound}/{entry.totalWords} words
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
