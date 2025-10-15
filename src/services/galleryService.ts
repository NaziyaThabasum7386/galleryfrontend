import { supabase } from '../lib/supabase';
import type { GalleryItem, GalleryUpload } from '../types/gallery';

const STORAGE_BUCKET = 'gallery-images';

export class GalleryService {
  /**
   * Fetch all gallery images, optionally filtered by category
   */
  static async getAll(category?: string): Promise<GalleryItem[]> {
    try {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All Categories') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  }

  /**
   * Get a single gallery image by ID
   */
  static async getById(id: string): Promise<GalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gallery image:', error);
      throw error;
    }
  }

  /**
   * Upload image file to Supabase Storage
   */
  static async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Create a new gallery image entry
   */
  static async create(upload: GalleryUpload): Promise<GalleryItem> {
    try {
      const imageUrl = await this.uploadImage(upload.file);

      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          title: upload.title,
          category: upload.category,
          description: upload.description || '',
          image_url: imageUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  }

  /**
   * Create multiple gallery images at once
   */
  static async createBatch(uploads: GalleryUpload[]): Promise<GalleryItem[]> {
    try {
      const uploadPromises = uploads.map(async (upload) => {
        const imageUrl = await this.uploadImage(upload.file);
        return {
          title: upload.title,
          category: upload.category,
          description: upload.description || '',
          image_url: imageUrl
        };
      });

      const insertData = await Promise.all(uploadPromises);

      const { data, error } = await supabase
        .from('gallery_images')
        .insert(insertData)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error creating batch gallery images:', error);
      throw error;
    }
  }

  /**
   * Update an existing gallery image
   */
  static async update(
    id: string,
    updates: Partial<Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }
  }

  /**
   * Delete a gallery image and its file from storage
   */
  static async delete(id: string): Promise<void> {
    try {
      // First get the image to retrieve the file path
      const image = await this.getById(id);

      if (!image) {
        throw new Error('Image not found');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Extract file path from URL and delete from storage
      if (image.image_url) {
        const urlParts = image.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([fileName]);

        if (storageError) {
          console.warn('Error deleting image from storage:', storageError);
        }
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }
  }

  /**
   * Get count of images by category
   */
  static async getCountByCategory(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('category');

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(item => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error getting category counts:', error);
      throw error;
    }
  }
}
