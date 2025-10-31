import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminWordForm, { WordFormData } from '@/components/AdminWordForm';
import WordListCard, { WordData } from '@/components/WordListCard';
import { Link } from 'wouter';

export default function AdminPage() {
  const [words, setWords] = useState<WordData[]>([
    { id: '1', word: 'QUALITY', clue: 'Standard of excellence', direction: 'across' },
    { id: '2', word: 'TEAMWORK', clue: 'Collaborative effort', direction: 'across' },
    { id: '3', word: 'EXCELLENCE', clue: 'Outstanding quality', direction: 'across' },
    { id: '4', word: 'PROCESS', clue: 'Series of actions', direction: 'down' },
    { id: '5', word: 'IMPROVEMENT', clue: 'Making something better', direction: 'down' },
    { id: '6', word: 'SAFETY', clue: 'Protection from harm', direction: 'across' },
    { id: '7', word: 'STANDARD', clue: 'Established norm', direction: 'down' },
    { id: '8', word: 'FEEDBACK', clue: 'Constructive response', direction: 'across' },
    { id: '9', word: 'AUDIT', clue: 'Official inspection', direction: 'down' },
    { id: '10', word: 'CUSTOMER', clue: 'Person who buys', direction: 'across' },
  ]);
  const [editingWord, setEditingWord] = useState<WordData | null>(null);

  const handleAddWord = (data: WordFormData) => {
    const newWord: WordData = {
      id: Date.now().toString(),
      ...data,
    };
    setWords([...words, newWord]);
    console.log('Word added:', newWord);
  };

  const handleEditWord = (data: WordFormData) => {
    if (!editingWord) return;
    setWords(words.map((w) => (w.id === editingWord.id ? { ...w, ...data } : w)));
    setEditingWord(null);
    console.log('Word updated:', data);
  };

  const handleDeleteWord = (id: string) => {
    setWords(words.filter((w) => w.id !== id));
    console.log('Word deleted:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-to-game">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-word-count">
                {words.length} words in database
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
}
