export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

export interface GalleryUpload {
  title: string;
  category: string;
  description?: string;
  file: File;
}

export type GalleryCategory =
  | 'All Categories'
  | 'Events'
  | 'Causes'
  | 'Volunteers'
  | 'Community'
  | 'Environment'
  | 'Healthcare'
  | 'Fundraising'
  | 'Team';
