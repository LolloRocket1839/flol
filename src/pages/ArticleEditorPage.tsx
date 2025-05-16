
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Article, ArticleFormData } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";

const ArticleEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
  });

  useEffect(() => {
    if (!isNew) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              title: data.title,
              slug: data.slug,
              content: data.content,
              excerpt: data.excerpt,
              published: data.published,
            });
          }
        } catch (error: any) {
          toast({
            title: "Errore",
            description: error.message || "Impossibile caricare l'articolo",
            variant: "destructive",
          });
          navigate("/admin");
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id, isNew, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      published: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!user) throw new Error("Utente non autenticato");

      const articleData = {
        ...formData,
        author_id: user.id,
      };

      if (isNew) {
        // Crea un nuovo articolo
        const { data, error } = await supabase
          .from("articles")
          .insert([articleData])
          .select();

        if (error) throw error;
        toast({
          title: "Articolo creato",
          description: "L'articolo è stato creato con successo.",
        });
        navigate(`/admin`);
      } else {
        // Aggiorna l'articolo esistente
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);

        if (error) throw error;
        toast({
          title: "Articolo aggiornato",
          description: "L'articolo è stato aggiornato con successo.",
        });
        navigate(`/admin`);
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il salvataggio",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla lista
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Nuovo Articolo" : "Modifica Articolo"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Titolo
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Titolo dell'articolo"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="slug-url-articolo"
            required
          />
          <p className="text-xs text-gray-500">
            L'URL dell'articolo: /articoli/{formData.slug}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-medium">
            Estratto
          </label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Breve descrizione dell'articolo"
            required
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Contenuto
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenuto dell'articolo in HTML"
            required
            rows={15}
          />
          <p className="text-xs text-gray-500">
            Inserisci il contenuto in formato HTML.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            checked={formData.published}
            onCheckedChange={handleCheckboxChange}
          />
          <label
            htmlFor="published"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Pubblica articolo
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isNew ? "Crea articolo" : "Aggiorna articolo"}
          </Button>
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <a href={`/articoli/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Visualizza articolo
              </a>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ArticleEditorPage;
