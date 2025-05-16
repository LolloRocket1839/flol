
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BlogPage = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: error.message || 'Impossibile caricare gli articoli',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fintool-blue mb-4">Articoli</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Approfondimenti e guide sul mondo della finanza personale
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Nessun articolo pubblicato.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link to={`/articoli/${post.slug}`} className="hover:text-fintool-teal transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {new Date(post.date).toLocaleDateString('it-IT', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link to={`/articoli/${post.slug}`}>Leggi l'articolo</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
