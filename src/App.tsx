import React, { Suspense, lazy, memo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from "@/components/ui/toaster";
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded pages with preloading
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const ThoughtsOfTheWeek = lazy(() => import('./pages/ThoughtsOfTheWeek'));

// Preload critical routes
const preloadRoutes = () => {
  // Preload main routes in the background
  const timer = setTimeout(() => {
    import('./pages/HomePage');
    import('./pages/BlogPage');
  }, 1000);
  return () => clearTimeout(timer);
};

// Styles
import './App.css';

// Memoized route components for better performance
const MemoizedHomePage = memo(() => <HomePage />);
const MemoizedBlogPage = memo(() => <BlogPage />);
const MemoizedBlogPostPage = memo(() => <BlogPostPage />);

function App() {
  // Start preloading routes
  useEffect(preloadRoutes, []);
  
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary fallback={<div className="text-center p-8">Si è verificato un errore. <button onClick={() => window.location.reload()} className="text-blue-500 underline">Ricarica</button></div>}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<MemoizedHomePage />} />
              <Route path="/articoli" element={<MemoizedBlogPage />} />
              <Route path="/articoli/:slug" element={<MemoizedBlogPostPage />} />
              <Route path="/tool" element={<ToolsPage />} />
              <Route path="/tool/:slug" element={<ToolPage />} />
              <Route path="/biblioteca/thoughts" element={<ThoughtsOfTheWeek />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default memo(App);
