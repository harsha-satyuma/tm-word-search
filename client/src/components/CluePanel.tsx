import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

export interface Clue {
  number: number;
  text: string;
  direction: 'across' | 'down';
}

export interface CluePanelProps {
  clues: Clue[];
  activeClue?: number;
}

export default function CluePanel({ clues, activeClue }: CluePanelProps) {
  const acrossClues = clues.filter(c => c.direction === 'across');
  const downClues = clues.filter(c => c.direction === 'down');

  const ClueList = ({ title, clueList }: { title: string; clueList: Clue[] }) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold sticky top-0 bg-card pb-2 pt-2">{title}</h3>
      <div className="space-y-1">
        {clueList.map((clue) => (
          <div
            key={`${clue.direction}-${clue.number}`}
            className={`p-2 rounded-md transition-all ${
              activeClue === clue.number
                ? 'bg-primary/10 border-l-4 border-primary font-semibold'
                : 'hover-elevate'
            }`}
            data-testid={`clue-${clue.direction}-${clue.number}`}
          >
            <span className="font-medium text-muted-foreground">{clue.number}.</span>{' '}
            <span>{clue.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Clues</h2>
      <ScrollArea className="h-96">
        <div className="pr-4 space-y-6">
          {acrossClues.length > 0 && <ClueList title="Across" clueList={acrossClues} />}
          {downClues.length > 0 && <ClueList title="Down" clueList={downClues} />}
        </div>
      </ScrollArea>
    </Card>
  );
}
