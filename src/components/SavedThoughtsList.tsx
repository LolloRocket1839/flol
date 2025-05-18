import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Key for localStorage
const SAVED_THOUGHTS_KEY = 'flol_saved_thoughts';

// Interface for saved thought
interface SavedThought {
  id: number;
  title: string;
  savedAt: string;
}

const SavedThoughtsList = () => {
  const [savedThoughts, setSavedThoughts] = useState<SavedThought[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load saved thoughts from localStorage
  useEffect(() => {
    const loadSavedThoughts = () => {
      try {
        const savedJson = localStorage.getItem(SAVED_THOUGHTS_KEY);
        const thoughts = savedJson ? JSON.parse(savedJson) : [];
        // Sort by most recently saved
        thoughts.sort((a: SavedThought, b: SavedThought) => 
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );
        setSavedThoughts(thoughts);
      } catch (error) {
        console.error('Error loading saved thoughts:', error);
        toast({
          title: 'Error',
          description: 'Could not load your saved thoughts',
          variant: 'destructive',
        });
      }
    };

    // Load immediately
    loadSavedThoughts();

    // Set up an event listener to handle changes from other components
    window.addEventListener('storage', loadSavedThoughts);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', loadSavedThoughts);
    };
  }, []);

  // Remove a saved thought
  const removeThought = (id: number) => {
    try {
      const updatedThoughts = savedThoughts.filter(thought => thought.id !== id);
      localStorage.setItem(SAVED_THOUGHTS_KEY, JSON.stringify(updatedThoughts));
      setSavedThoughts(updatedThoughts);
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: 'Thought removed',
        description: 'This thought has been removed from your saved items',
      });
    } catch (error) {
      console.error('Error removing thought:', error);
      toast({
        title: 'Error',
        description: 'Could not remove this thought. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Clear all saved thoughts
  const clearAllThoughts = () => {
    try {
      localStorage.removeItem(SAVED_THOUGHTS_KEY);
      setSavedThoughts([]);
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: 'All thoughts cleared',
        description: 'Your saved thoughts collection has been cleared',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error clearing thoughts:', error);
      toast({
        title: 'Error',
        description: 'Could not clear your thoughts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-fintool-blue" />
          Pensieri Salvati
        </h2>
        
        {savedThoughts.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Cancella Tutti
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Conferma cancellazione</DialogTitle>
                <DialogDescription>
                  Sei sicuro di voler cancellare tutti i pensieri salvati? Questa azione non può essere annullata.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button variant="destructive" onClick={clearAllThoughts}>
                  Cancella Tutti
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {savedThoughts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-500">Non hai ancora salvato nessun pensiero.</p>
            <p className="text-sm text-gray-400 mt-2">
              Clicca il pulsante "Salva" sui pensieri che desideri conservare.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedThoughts.map((thought) => (
            <Card key={thought.id}>
              <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{thought.title}</CardTitle>
                    <CardDescription>
                      Salvato il {formatDate(thought.savedAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/biblioteca/thoughts#thought-${thought.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeThought(thought.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedThoughtsList; 