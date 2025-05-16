
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Article } from "@/types/article";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, Edit, Trash2, Eye, LogOut, Plus } from "lucide-react";

const AdminPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  // Carica gli articoli
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error: any) {
        toast({
          title: "Errore",
          description: error.message || "Impossibile caricare gli articoli",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo articolo?")) {
      try {
        const { error } = await supabase.from("articles").delete().eq("id", id);
        if (error) throw error;
        setArticles(articles.filter((article) => article.id !== id));
        toast({
          title: "Articolo eliminato",
          description: "L'articolo è stato eliminato con successo.",
        });
      } catch (error: any) {
        toast({
          title: "Errore",
          description: error.message || "Impossibile eliminare l'articolo",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pannello di Amministrazione</h1>
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link to="/admin/new">
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Articolo
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-lg text-gray-500">Nessun articolo trovato</p>
          <Button asChild className="mt-4">
            <Link to="/admin/new">Crea il tuo primo articolo</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.published ? "Pubblicato" : "Bozza"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(article.date).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/articoli/${article.slug}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/edit/${article.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
