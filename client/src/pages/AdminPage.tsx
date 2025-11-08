import { useState, useEffect } from "react";
import { ArrowLeft, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminWordForm, { WordFormData } from "@/components/AdminWordForm";
import WordListCard, { WordData } from "@/components/WordListCard";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

interface LeaderboardEntry {
  id: number;
  employeeId: string;
  name: string;
  department: string;
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
  const [words, setWords] = useState<WordData[]>([]);
  const [editingWord, setEditingWord] = useState<WordData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timerDuration, setTimerDuration] = useState("10");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

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
    fetchSettings();
    fetchWords();
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

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (response.ok && data.settings?.timerDuration) {
        setTimerDuration(data.settings.timerDuration);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/words");
      const data = await response.json();
      if (response.ok) {
        setWords(data.words.map((w: any) => ({
          id: w.id.toString(),
          word: w.word,
          clue: w.clue,
          direction: w.direction,
        })));
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

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const duration = parseInt(timerDuration, 10);
      if (isNaN(duration) || duration < 5 || duration > 600) {
        toast({
          title: "Invalid Duration",
          description: "Timer duration must be between 5 and 600 seconds",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "timerDuration",
          value: timerDuration,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast({
        title: "Settings Saved",
        description: "Timer duration updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
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

  const handleAddWord = async (data: WordFormData) => {
    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add word");
      }

      toast({
        title: "Success",
        description: "Word added successfully",
      });
      
      fetchWords();
    } catch (error) {
      console.error("Error adding word:", error);
      toast({
        title: "Error",
        description: "Failed to add word",
        variant: "destructive",
      });
    }
  };

  const handleEditWord = async (data: WordFormData) => {
    if (!editingWord) return;
    
    try {
      const response = await fetch(`/api/words/${editingWord.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update word");
      }

      toast({
        title: "Success",
        description: "Word updated successfully",
      });
      
      setEditingWord(null);
      fetchWords();
    } catch (error) {
      console.error("Error updating word:", error);
      toast({
        title: "Error",
        description: "Failed to update word",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWord = async (id: string) => {
    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete word");
      }

      toast({
        title: "Success",
        description: "Word deleted successfully",
      });
      
      fetchWords();
    } catch (error) {
      console.error("Error deleting word:", error);
      toast({
        title: "Error",
        description: "Failed to delete word",
        variant: "destructive",
      });
    }
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
        <div className="space-y-8">
          {/* Game Settings Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Game Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timer-duration">Timer Duration (seconds)</Label>
                <div className="flex gap-2">
                  <Input
                    id="timer-duration"
                    type="number"
                    min="5"
                    max="600"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(e.target.value)}
                    disabled={isSavingSettings}
                    data-testid="input-timer-duration"
                  />
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    data-testid="button-save-settings"
                  >
                    {isSavingSettings ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {Math.floor(parseInt(timerDuration) / 60)}:
                  {(parseInt(timerDuration) % 60).toString().padStart(2, "0")}{" "}
                  (Min: 5s, Max: 600s)
                </p>
              </div>
            </div>
          </div>

          {/* Word Management and Leaderboard Section */}
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
                            <p className="text-xs text-muted-foreground">
                              {entry.department}
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
    </div>
  );
}
