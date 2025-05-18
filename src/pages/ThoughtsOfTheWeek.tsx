import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Bookmark, ExternalLink, Plus, Trash2 } from 'lucide-react';
import ThoughtSaver from '@/components/ThoughtSaver';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import SavedThoughtsList from '@/components/SavedThoughtsList';

interface WeeklyThought {
  id?: number;
  title: string;
  content: string;
  date: string;
  links: NewsletterLink[];
}

interface NewsletterLink {
  id?: number;
  title: string;
  url: string;
  thought_id?: number;
}

const ThoughtsOfTheWeek = () => {
  const [thoughts, setThoughts] = useState<WeeklyThought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentThought, setCurrentThought] = useState<WeeklyThought>({
    title: '',
    content: '',
    date: new Date().toISOString(),
    links: []
  });
  const [newLink, setNewLink] = useState<NewsletterLink>({
    title: '',
    url: ''
  });

  // Fetch thoughts from Supabase
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        setIsLoading(true);
        
        // Get all thoughts
        const { data: thoughtsData, error: thoughtsError } = await supabase
          .from('weekly_thoughts')
          .select('*')
          .order('date', { ascending: false });
          
        if (thoughtsError) throw thoughtsError;
        
        // Get all links
        const { data: linksData, error: linksError } = await supabase
          .from('newsletter_links')
          .select('*');
          
        if (linksError) throw linksError;
        
        // Combine thoughts with their links
        const thoughtsWithLinks = thoughtsData?.map(thought => ({
          ...thought,
          links: linksData?.filter(link => link.thought_id === thought.id) || []
        })) || [];
        
        setThoughts(thoughtsWithLinks);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Unable to load thoughts',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThoughts();
  }, []);

  // Save a new thought and its links
  const saveThought = async () => {
    try {
      // Validate
      if (!currentThought.title || !currentThought.content) {
        toast({
          title: 'Missing fields',
          description: 'Please add a title and content',
          variant: 'destructive',
        });
        return;
      }

      // Add thought to Supabase
      const { data: thoughtData, error: thoughtError } = await supabase
        .from('weekly_thoughts')
        .insert([{
          title: currentThought.title,
          content: currentThought.content,
          date: currentThought.date
        }])
        .select();
        
      if (thoughtError) throw thoughtError;
      
      // If we have links, add them as well
      if (currentThought.links.length > 0 && thoughtData) {
        const thoughtId = thoughtData[0].id;
        
        const linksToInsert = currentThought.links.map(link => ({
          title: link.title,
          url: link.url,
          thought_id: thoughtId
        }));
        
        const { error: linksError } = await supabase
          .from('newsletter_links')
          .insert(linksToInsert);
          
        if (linksError) throw linksError;
      }
      
      // Reset form and refresh data
      setCurrentThought({
        title: '',
        content: '',
        date: new Date().toISOString(),
        links: []
      });
      
      toast({
        title: 'Success',
        description: 'Your thought has been added',
      });
      
      // Refresh thoughts
      const { data: refreshedThoughts, error: refreshError } = await supabase
        .from('weekly_thoughts')
        .select('*')
        .order('date', { ascending: false });
        
      if (refreshError) throw refreshError;
      
      // Get all links
      const { data: linksData, error: linksError } = await supabase
        .from('newsletter_links')
        .select('*');
        
      if (linksError) throw linksError;
      
      // Combine thoughts with their links
      const thoughtsWithLinks = refreshedThoughts?.map(thought => ({
        ...thought,
        links: linksData?.filter(link => link.thought_id === thought.id) || []
      })) || [];
      
      setThoughts(thoughtsWithLinks);
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Unable to save your thought',
        variant: 'destructive',
      });
    }
  };

  // Add a link to the current thought
  const addLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: 'Missing fields',
        description: 'Please add a title and URL for the link',
        variant: 'destructive',
      });
      return;
    }
    
    setCurrentThought(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    
    setNewLink({
      title: '',
      url: ''
    });
  };

  // Remove a link from the current thought
  const removeLink = (index: number) => {
    setCurrentThought(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Format the date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-fintool-blue mb-2">Thoughts of the Week</h1>
          <p className="text-lg text-gray-600">Inspiring ideas and newsletter links from the financial literacy library.</p>
        </div>
        
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              I Miei Pensieri Salvati
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="max-w-3xl mx-auto py-4 px-4">
              <DrawerHeader>
                <DrawerTitle>I Miei Pensieri Salvati</DrawerTitle>
                <DrawerDescription>
                  Qui trovi i pensieri che hai salvato per leggere più tardi.
                </DrawerDescription>
              </DrawerHeader>
              <SavedThoughtsList />
              <div className="mt-6 flex justify-end">
                <DrawerClose asChild>
                  <Button variant="outline">Chiudi</Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      {/* Editor section (only visible when editing) */}
      {isEditing ? (
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Add New Thought</CardTitle>
            <CardDescription>Share your thoughts and inspiring newsletter links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Title
              </label>
              <Input 
                id="title"
                value={currentThought.title}
                onChange={e => setCurrentThought(prev => ({ ...prev, title: e.target.value }))}
                placeholder="This week's thought..." 
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="content">
                Content
              </label>
              <Textarea 
                id="content"
                value={currentThought.content}
                onChange={e => setCurrentThought(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your insights..."
                className="min-h-[150px]"
              />
            </div>
            
            {/* Newsletter Links */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Newsletter Links</h3>
              
              {/* Current links */}
              {currentThought.links.length > 0 && (
                <div className="mb-4 space-y-2">
                  {currentThought.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-blue-500 truncate">{link.url}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeLink(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new link */}
              <div className="flex flex-col gap-2">
                <Input 
                  placeholder="Newsletter title"
                  value={newLink.title}
                  onChange={e => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input 
                  placeholder="URL (https://...)"
                  value={newLink.url}
                  onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addLink}
                  className="self-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveThought}>
              Save Thought
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button onClick={() => setIsEditing(true)} className="mb-8">
          <Plus className="h-4 w-4 mr-2" />
          Add New Thought
        </Button>
      )}
      
      {/* Display thoughts */}
      {thoughts.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-xl text-gray-500 mb-4">No thoughts yet.</p>
          <p className="text-gray-400">Add your first thought to get started!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {thoughts.map(thought => (
            <Card key={thought.id} id={`thought-${thought.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{thought.title}</CardTitle>
                    <CardDescription>{formatDate(thought.date)}</CardDescription>
                  </div>
                  {thought.id && (
                    <ThoughtSaver thoughtId={thought.id} title={thought.title} />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose">
                  <p>{thought.content}</p>
                  
                  {thought.links && thought.links.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2">Inspiring Newsletters</h4>
                      <ul className="space-y-1 list-none pl-0">
                        {thought.links.map((link, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ThoughtsOfTheWeek); 