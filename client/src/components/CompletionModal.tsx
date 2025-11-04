import { useEffect, useState } from "react";
import { Trophy, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completionTime: number;
  onSubmit: () => void;
}

export default function CompletionModal({
  isOpen,
  onClose,
  completionTime,
  onSubmit,
}: CompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: [
                  "#3b82f6",
                  "#ef4444",
                  "#10b981",
                  "#f59e0b",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" data-testid="modal-completion">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center text-3xl">
              <Trophy className="w-8 h-8 text-primary" />
              Congratulations!
              <Sparkles className="w-8 h-8 text-primary" />
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6 py-4">
            <p className="text-lg text-muted-foreground">
              You completed the puzzle in
            </p>
            <div
              className="text-5xl font-bold text-primary tabular-nums"
              data-testid="text-completion-time"
            >
              {formatTime(completionTime)}
            </div>
            <p className="text-sm text-muted-foreground">
              Your result has been saved to the leaderboard!
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={handleSubmit}
              data-testid="button-close-modal"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
