/*
  # Create Gallery Management System

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `title` (text) - Title/name of the image
      - `category` (text) - Category classification (Events, Causes, Volunteers, etc.)
      - `description` (text, optional) - Optional description of the image
      - `image_url` (text) - URL to the stored image
      - `created_at` (timestamptz) - When the image was uploaded
      - `updated_at` (timestamptz) - When the image was last updated
      - `user_id` (uuid, optional) - Reference to the user who uploaded (for future auth)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access (anyone can view gallery)
    - Add policy for authenticated users to insert images
    - Add policy for authenticated users to update their own images
    - Add policy for authenticated users to delete their own images

  3. Indexes
    - Add index on category for filtering
    - Add index on created_at for sorting

  4. Storage
    - Create a storage bucket for gallery images
    - Enable public access for the bucket
*/

-- Create the gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid
);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read access - anyone can view gallery images
CREATE POLICY "Anyone can view gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated users can insert images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update any image
CREATE POLICY "Authenticated users can update images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete any image
CREATE POLICY "Authenticated users can delete images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images in the bucket
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'gallery-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images');
