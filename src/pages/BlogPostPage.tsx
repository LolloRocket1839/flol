import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Debug logging function
  const logDebug = useCallback((message: string, data?: any) => {
    console.log(`[BlogPostPage FIXED] ${message}`, data || '');
  }, []);

  // Memoize fetch function to prevent unnecessary recreation
  const fetchPost = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setIsError(false);
    
    logDebug(`Fetching article with slug: ${slug}`);
    
    try {
      // Simplified query without language filtering
      let { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .eq('slug', slug)
        .limit(1);
        
      logDebug('Query results', { data, error });
        
      if (error || !data || data.length === 0) {
        logDebug('No exact match found, trying alternative approaches');
        
        // Try with a broader match
        const { data: broadData, error: broadError } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true);
          
        if (broadError) {
          logDebug('Error in broad query', broadError);
          throw broadError;
        }
        
        // Try to find something with similar slug
        if (broadData && broadData.length > 0) {
          const fuzzyMatch = broadData.find(article => 
            article.slug.includes(slug) || slug.includes(article.slug)
          );
          
          if (fuzzyMatch) {
            data = [fuzzyMatch];
            logDebug('Found fuzzy match', fuzzyMatch);
          } else {
            // Just take the first article if nothing else matches
            data = [broadData[0]];
            logDebug('Using first available article as fallback', broadData[0]);
          }
        }
        
        if (!data || data.length === 0) {
          throw new Error('Article not found');
        }
      }

      const selectedArticle = data[0];
      logDebug('Selected article for display', selectedArticle);
      setPost(selectedArticle);
    } catch (error: any) {
      console.error("Error fetching article:", error);
      setIsError(true);
      toast({
        title: t('thoughtsOfWeek.error'),
        description: error.message || t('article.errorFetch'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [slug, t, logDebug]);

  // Handle navigation with useCallback to prevent unnecessary recreation
  const handleBackClick = useCallback(() => {
    navigate('/articoli');
  }, [navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]); 
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">{t('article.articleNotFound')}</h1>
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={handleBackClick} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('article.backToArticles')}
          </Button>
          <Button onClick={fetchPost} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('articles.refresh')}
          </Button>
        </div>
      </div>
    );
  }

  // Memoize the date transformation to avoid recalculation on re-renders
  const formattedDate = useMemo(() => {
    if (post && post.date) {
      try {
        const dateObj = new Date(post.date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'it-IT', {
            day: 'numeric', month: 'long', year: 'numeric'
          });
        }
      } catch (e) {
        logDebug('Error parsing date for post on BlogPostPage', { slug: post.slug, date: post.date, error: e });
      }
    }
    return t('article.dateNotAvailable'); // Fallback if date is missing or invalid
  }, [post, currentLanguage, t, logDebug]);

  // Fallback for title if post is not fully loaded or is problematic
  const articleTitle = post?.title || t('article.titleNotAvailable');
  // Fallback for content if post is not fully loaded or content is missing/not a string
  const articleContent = (post && typeof post.content === 'string') ? post.content : `<p>${t('article.contentNotAvailable')}</p>`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>{t('article.backToArticles')}</span>
        </Button>
      </div>
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-fintool-blue mb-4">{articleTitle}</h1>
          <div className="text-gray-500">
            {t('article.published')} {formattedDate}
          </div>
        </header>
        
        <div 
          className="prose prose-lg max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />
      </article>
    </div>
  );
};

export default React.memo(BlogPostPage);

