
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllPosts } from '@/utils/markdown';

const BlogPage = () => {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fintool-blue mb-4">Articoli</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Approfondimenti e guide sul mondo della finanza personale
        </p>
      </div>

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
    </div>
  );
};

export default BlogPage;
