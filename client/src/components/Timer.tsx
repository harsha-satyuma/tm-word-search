import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export interface TimerProps {
  duration: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
  onTick?: (remaining: number) => void;
}

export default function Timer({ duration, onTimeUp, isPaused = false, onTick }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (onTick) onTick(newTime);
        if (newTime === 0 && onTimeUp) {
          onTimeUp();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining < 60 && timeRemaining > 0;

  return (
    <div className="flex items-center gap-2" data-testid="timer-display">
      <Clock className={`w-6 h-6 ${isWarning ? 'text-destructive' : 'text-muted-foreground'}`} />
      <span
        className={`text-3xl md:text-4xl font-bold font-mono tabular-nums ${
          isWarning ? 'text-destructive animate-pulse-scale' : 'text-foreground'
        }`}
      >
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
