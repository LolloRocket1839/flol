
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from "@/components/ui/toaster";

// Pages
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';

// Stili
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articoli" element={<BlogPage />} />
            <Route path="/articoli/:slug" element={<BlogPostPage />} />
            <Route path="/tool" element={<ToolsPage />} />
            <Route path="/tool/:slug" element={<ToolPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
