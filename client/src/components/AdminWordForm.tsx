import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

export interface WordFormData {
  word: string;
  clue: string;
  direction: 'across' | 'down';
}

export interface AdminWordFormProps {
  onSubmit: (data: WordFormData) => void;
  initialData?: WordFormData;
  isEditing?: boolean;
}

export default function AdminWordForm({ onSubmit, initialData, isEditing = false }: AdminWordFormProps) {
  const [word, setWord] = useState(initialData?.word || '');
  const [clue, setClue] = useState(initialData?.clue || '');
  const [direction, setDirection] = useState<'across' | 'down'>(initialData?.direction || 'across');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && clue.trim()) {
      onSubmit({ word: word.toUpperCase().trim(), clue: clue.trim(), direction });
      if (!isEditing) {
        setWord('');
        setClue('');
        setDirection('across');
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
          <Label>Direction</Label>
          <RadioGroup value={direction} onValueChange={(v) => setDirection(v as 'across' | 'down')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="across" id="across" data-testid="radio-across" />
              <Label htmlFor="across" className="font-normal cursor-pointer">Across</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="down" id="down" data-testid="radio-down" />
              <Label htmlFor="down" className="font-normal cursor-pointer">Down</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full" data-testid="button-submit-word">
          <Plus className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Word' : 'Add Word'}
        </Button>
      </form>
    </Card>
  );
}
