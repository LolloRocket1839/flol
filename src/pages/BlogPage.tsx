import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logDebug = useCallback((message: string, data?: any) => {
    console.log(`[BlogPage FIXED] ${message}`, data || '');
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true); // Indicate refreshing
    logDebug('Fetching articles (without language filtering)');
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, date, excerpt, published') // Removed language field
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        logDebug('Error fetching articles', error);
        throw error;
      }
      
      logDebug('Fetched articles from Supabase', data);
      
      if (data && data.length > 0) {
        setPosts(data);
        logDebug('Set posts with all fetched articles', data);
      } else {
        setPosts([]);
        logDebug('No articles returned from Supabase');
      }

    } catch (error: any) {
      console.error("Error fetching articles:", error);
      setPosts([]); // Set to empty array on error
      toast({
        title: t('thoughtsOfWeek.error'),
        description: error.message || t('articles.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, logDebug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Removed language dependency

  const handleRefresh = useCallback(() => {
    fetchPosts(); // Directly call fetchPosts
  }, [fetchPosts]);

  if (isLoading && posts.length === 0) { // Show loader only on initial load
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fintool-blue mb-4">{t('articles.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('articles.subtitle')}
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('articles.refreshing') : t('articles.refresh')}
        </Button>
      </div>

      {posts.length === 0 && !isLoading ? ( // Show "no articles" only if not loading and posts are empty
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-6">{t('articles.noArticles')}</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
             {t('articles.refresh')}
          </Button>
        </div>
      ) : (
          <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => {
            // Ensure post and post.slug are defined before creating a link
            if (!post || !post.slug) {
              logDebug('Skipping rendering of an invalid post object', post);
              return null; 
            }

            logDebug('Rendering article card', { 
              id: post.id, 
              slug: post.slug, 
              title: post.title, 
              date: post.date
            });
            const articleLink = `/articoli/${post.slug}`;
            logDebug('Generated article link', { articleLink });

            let displayDate = t('article.dateNotAvailable');
            if (post.date) {
              try {
                const dateObj = new Date(post.date);
                if (!isNaN(dateObj.getTime())) {
                  displayDate = dateObj.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'it-IT', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  });
                } else {
                  logDebug('Invalid date object encountered for post', { slug: post.slug, date: post.date });
                }
              } catch (e) {
                logDebug('Error parsing date for post', { slug: post.slug, date: post.date, error: e });
              }
            } else {
              logDebug('Missing date for post', { slug: post.slug });
            }

            return (
              <Card key={post.id || post.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>
                    <Link 
                      to={articleLink} 
                      className="hover:text-fintool-teal transition-colors"
                      onClick={() => logDebug('Article link clicked', { slug: post.slug, generatedLink: articleLink })}
                    >
                      {post.title || t('article.titleNotAvailable')}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {displayDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.excerpt || t('article.excerptNotAvailable')}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild 
                    variant="outline"
                    onClick={() => logDebug('Read article button clicked', { slug: post.slug, generatedLink: articleLink })}
                  >
                    <Link to={articleLink}>{t('articles.readArticle')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          </div>
      )}
    </div>
  );
};

export default React.memo(BlogPage);
