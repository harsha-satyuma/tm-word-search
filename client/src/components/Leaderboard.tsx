import { Trophy, Medal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface LeaderboardEntry {
  id: string;
  name: string;
  time: number;
  rank: number;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card className="w-80 h-full">
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold" data-testid="text-leaderboard-title">Top Solvers</h2>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="p-4 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">Be the first to complete!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-md bg-accent/50 hover-elevate"
                data-testid={`leaderboard-entry-${entry.id}`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" data-testid={`text-player-name-${entry.id}`}>
                    {entry.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-lg font-semibold font-mono tabular-nums" data-testid={`text-time-${entry.id}`}>
                    {formatTime(entry.time)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
