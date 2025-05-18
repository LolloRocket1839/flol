export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  date: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  language?: string;
}
