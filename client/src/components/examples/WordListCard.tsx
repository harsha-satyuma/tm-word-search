import WordListCard, { WordData } from '../WordListCard';

export default function WordListCardExample() {
  const word: WordData = {
    id: '1',
    word: 'EXAMPLE',
    clue: 'A sample or illustration of something',
    direction: 'across',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <WordListCard
          word={word}
          onEdit={(w) => console.log('Edit word:', w)}
          onDelete={(id) => console.log('Delete word:', id)}
        />
      </div>
    </div>
  );
}
