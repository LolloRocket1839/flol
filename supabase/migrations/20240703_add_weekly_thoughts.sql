-- Create weekly_thoughts table
CREATE TABLE IF NOT EXISTS weekly_thoughts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create newsletter_links table with relationship to weekly_thoughts
CREATE TABLE IF NOT EXISTS newsletter_links (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thought_id INTEGER REFERENCES weekly_thoughts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some indexes for performance
CREATE INDEX IF NOT EXISTS weekly_thoughts_date_idx ON weekly_thoughts(date);
CREATE INDEX IF NOT EXISTS newsletter_links_thought_id_idx ON newsletter_links(thought_id);

-- Add RLS policies
ALTER TABLE weekly_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_links ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read thoughts and links
CREATE POLICY "Allow anonymous read access to weekly_thoughts" 
  ON weekly_thoughts FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous read access to newsletter_links" 
  ON newsletter_links FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert access to weekly_thoughts" 
  ON weekly_thoughts FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to weekly_thoughts" 
  ON weekly_thoughts FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated delete access to weekly_thoughts" 
  ON weekly_thoughts FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated insert access to newsletter_links" 
  ON newsletter_links FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to newsletter_links" 
  ON newsletter_links FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated delete access to newsletter_links" 
  ON newsletter_links FOR DELETE 
  TO authenticated 
  USING (true); 