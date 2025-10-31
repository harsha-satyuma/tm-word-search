import { useState } from 'react';
import CompletionModal from '../CompletionModal';
import { Button } from '@/components/ui/button';

export default function CompletionModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex items-center justify-center p-8">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Open Completion Modal
      </Button>
      <CompletionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        completionTime={125}
        onSubmit={(name) => {
          console.log('Submitted name:', name);
          setIsOpen(false);
        }}
      />
    </div>
  );
}
