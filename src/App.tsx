
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './components/AuthProvider';
import { AdminRoute } from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import ArticleEditorPage from './pages/ArticleEditorPage';

// Stili
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articoli" element={<BlogPage />} />
              <Route path="/articoli/:slug" element={<BlogPostPage />} />
              <Route path="/tool" element={<ToolsPage />} />
              <Route path="/tool/:slug" element={<ToolPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Rotte protette admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/new" element={<ArticleEditorPage />} />
                <Route path="/admin/edit/:id" element={<ArticleEditorPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
