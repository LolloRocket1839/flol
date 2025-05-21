
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  date: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  author_id?: string | null;
  icon?: string;
  category?: string;
}
