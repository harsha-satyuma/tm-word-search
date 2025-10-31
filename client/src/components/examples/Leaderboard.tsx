import Leaderboard, { LeaderboardEntry } from '../Leaderboard';

export default function LeaderboardExample() {
  const entries: LeaderboardEntry[] = [
    { id: '1', name: 'Alice Johnson', time: 125, rank: 1 },
    { id: '2', name: 'Bob Smith', time: 148, rank: 2 },
    { id: '3', name: 'Carol Williams', time: 162, rank: 3 },
    { id: '4', name: 'David Brown', time: 195, rank: 4 },
    { id: '5', name: 'Emma Davis', time: 210, rank: 5 },
  ];

  return (
    <div className="flex items-center justify-center p-8 h-[600px]">
      <Leaderboard entries={entries} />
    </div>
  );
}
