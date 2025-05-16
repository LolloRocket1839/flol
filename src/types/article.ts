
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
}
