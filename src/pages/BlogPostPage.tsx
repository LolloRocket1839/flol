
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { toast } from '@/hooks/use-toast';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: error.message || 'Impossibile caricare l\'articolo',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
        <Button onClick={() => navigate('/articoli')}>
          Torna agli articoli
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/articoli')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Torna agli articoli</span>
        </Button>
      </div>
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-fintool-blue mb-4">{post.title}</h1>
          <div className="text-gray-500">
            {new Date(post.date).toLocaleDateString('it-IT', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
        </header>
        
        <div 
          className="prose prose-lg max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
};

export default BlogPostPage;
