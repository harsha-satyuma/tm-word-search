import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface WordListProps {
  words: string[];
  foundWords: Set<string>;
}

export default function WordList({ words, foundWords }: WordListProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Find These Words</h2>
      <div className="flex flex-wrap gap-3">
        {words.map((word) => {
          const isFound = foundWords.has(word);
          return (
            <div
              key={word}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium
                transition-all duration-300
                ${isFound 
                  ? 'bg-primary text-primary-foreground line-through' 
                  : 'bg-accent text-accent-foreground'
                }
              `}
              data-testid={`word-${word}`}
            >
              {isFound && <Check className="w-4 h-4" />}
              <span>{word}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Found: {foundWords.size} / {words.length}
      </div>
    </Card>
  );
}
