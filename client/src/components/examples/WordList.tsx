import WordList from '../WordList';

export default function WordListExample() {
  const words = ['QUALITY', 'TEAMWORK', 'EXCELLENCE', 'PROCESS', 'SAFETY'];
  const foundWords = new Set(['QUALITY', 'PROCESS']);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <WordList words={words} foundWords={foundWords} />
      </div>
    </div>
  );
}
