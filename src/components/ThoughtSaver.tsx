import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ThoughtSaverProps {
  thoughtId: number;
  title: string;
}

// Key for localStorage
const SAVED_THOUGHTS_KEY = 'flol_saved_thoughts';

// Interface for saved thought
interface SavedThought {
  id: number;
  title: string;
  savedAt: string;
}

const ThoughtSaver: React.FC<ThoughtSaverProps> = ({ thoughtId, title }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if this thought is already saved
  useEffect(() => {
    const savedThoughts = getSavedThoughts();
    setIsSaved(savedThoughts.some(thought => thought.id === thoughtId));
  }, [thoughtId]);

  // Get saved thoughts from localStorage
  const getSavedThoughts = (): SavedThought[] => {
    try {
      const savedJson = localStorage.getItem(SAVED_THOUGHTS_KEY);
      return savedJson ? JSON.parse(savedJson) : [];
    } catch (error) {
      console.error('Error reading saved thoughts:', error);
      return [];
    }
  };

  // Save thoughts to localStorage
  const saveToLocalStorage = (thoughts: SavedThought[]) => {
    try {
      localStorage.setItem(SAVED_THOUGHTS_KEY, JSON.stringify(thoughts));
    } catch (error) {
      console.error('Error saving thoughts:', error);
      toast({
        title: 'Error',
        description: 'Could not save this thought. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle save status
  const toggleSave = () => {
    const savedThoughts = getSavedThoughts();
    
    if (isSaved) {
      // Remove from saved thoughts
      const updatedThoughts = savedThoughts.filter(thought => thought.id !== thoughtId);
      saveToLocalStorage(updatedThoughts);
      setIsSaved(false);
      toast({
        title: 'Thought removed',
        description: 'This thought has been removed from your saved items',
      });
    } else {
      // Add to saved thoughts
      const newSavedThought: SavedThought = {
        id: thoughtId,
        title,
        savedAt: new Date().toISOString(),
      };
      
      saveToLocalStorage([...savedThoughts, newSavedThought]);
      setIsSaved(true);
      toast({
        title: 'Thought saved',
        description: 'This thought has been saved to your collection',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSave}
      className="flex items-center gap-1"
      title={isSaved ? "Remove from saved" : "Save this thought"}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500">Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span className="text-sm">Save</span>
        </>
      )}
    </Button>
  );
};

export default ThoughtSaver; 