
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '@/utils/markdown';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = slug ? getPostBySlug(slug) : undefined;
  
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
