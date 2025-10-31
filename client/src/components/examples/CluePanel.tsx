import CluePanel, { Clue } from '../CluePanel';

export default function CluePanelExample() {
  const clues: Clue[] = [
    { number: 1, text: 'Feline pet', direction: 'across' },
    { number: 2, text: 'Canine companion', direction: 'across' },
    { number: 3, text: 'Waterfowl with webbed feet', direction: 'across' },
    { number: 1, text: 'Programming language', direction: 'down' },
    { number: 2, text: 'Evergreen conifer', direction: 'down' },
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <CluePanel clues={clues} activeClue={1} />
    </div>
  );
}
