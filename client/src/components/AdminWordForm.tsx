import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export type Direction = 
  | 'left-right'
  | 'right-left'
  | 'top-bottom'
  | 'bottom-top'
  | 'diagonal-down-right'
  | 'diagonal-down-left'
  | 'diagonal-up-right'
  | 'diagonal-up-left';

export interface WordFormData {
  word: string;
  clue: string;
  direction: Direction;
}

export interface AdminWordFormProps {
  onSubmit: (data: WordFormData) => void;
  initialData?: WordFormData;
  isEditing?: boolean;
}

export default function AdminWordForm({ onSubmit, initialData, isEditing = false }: AdminWordFormProps) {
  const [word, setWord] = useState(initialData?.word || '');
  const [clue, setClue] = useState(initialData?.clue || '');
  const [direction, setDirection] = useState<Direction>(initialData?.direction || 'left-right');

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word);
      setClue(initialData.clue);
      setDirection(initialData.direction);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && clue.trim()) {
      onSubmit({ word: word.toUpperCase().trim(), clue: clue.trim(), direction });
      if (!isEditing) {
        setWord('');
        setClue('');
        setDirection('left-right');
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? 'Edit Word' : 'Add New Word'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word">Word</Label>
          <Input
            id="word"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            placeholder="EXAMPLE"
            data-testid="input-word"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clue">Clue</Label>
          <Textarea
            id="clue"
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            placeholder="A sample or illustration"
            rows={3}
            data-testid="input-clue"
            required
          />
          <p className="text-xs text-muted-foreground">{clue.length} characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">Direction</Label>
          <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
            <SelectTrigger id="direction" data-testid="select-direction">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left-right">Left to Right →</SelectItem>
              <SelectItem value="right-left">Right to Left ←</SelectItem>
              <SelectItem value="top-bottom">Top to Bottom ↓</SelectItem>
              <SelectItem value="bottom-top">Bottom to Top ↑</SelectItem>
              <SelectItem value="diagonal-down-right">Diagonal Down-Right ↘</SelectItem>
              <SelectItem value="diagonal-down-left">Diagonal Down-Left ↙</SelectItem>
              <SelectItem value="diagonal-up-right">Diagonal Up-Right ↗</SelectItem>
              <SelectItem value="diagonal-up-left">Diagonal Up-Left ↖</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" data-testid="button-submit-word">
          <Plus className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Word' : 'Add Word'}
        </Button>
      </form>
    </Card>
  );
}
