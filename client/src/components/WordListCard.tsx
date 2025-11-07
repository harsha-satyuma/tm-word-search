import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Direction } from './AdminWordForm';

export interface WordData {
  id: string;
  word: string;
  clue: string;
  direction: Direction;
}

export interface WordListCardProps {
  word: WordData;
  onEdit: (word: WordData) => void;
  onDelete: (id: string) => void;
}

const directionLabels: Record<Direction, string> = {
  'left-right': 'Left to Right →',
  'right-left': 'Right to Left ←',
  'top-bottom': 'Top to Bottom ↓',
  'bottom-top': 'Bottom to Top ↑',
  'diagonal-down-right': 'Diagonal ↘',
  'diagonal-down-left': 'Diagonal ↙',
  'diagonal-up-right': 'Diagonal ↗',
  'diagonal-up-left': 'Diagonal ↖',
};

export default function WordListCard({ word, onEdit, onDelete }: WordListCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid={`word-card-${word.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold font-mono" data-testid={`text-word-${word.id}`}>
              {word.word}
            </h3>
            <Badge variant="secondary" data-testid={`badge-direction-${word.id}`}>
              {directionLabels[word.direction]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground" data-testid={`text-clue-${word.id}`}>
            {word.clue}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(word)}
            data-testid={`button-edit-${word.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(word.id)}
            data-testid={`button-delete-${word.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
