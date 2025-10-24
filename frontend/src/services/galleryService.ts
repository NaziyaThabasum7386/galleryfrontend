// src/services/GalleryService.ts
import type { GalleryItem, GalleryUpload } from '../types/gallery';

const API_URL = 'http://localhost:5000/api/gallery';

export class GalleryService {
  /**
   * Fetch all gallery images
   */
  static async getAll(): Promise<GalleryItem[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch gallery items');
    return res.json();
  }

  /**
   * Get a single gallery image by ID
   */
  static async getById(id: string): Promise<GalleryItem | null> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  /**
   * Create a new gallery image entry (optional for future)
   */
  static async create(upload: GalleryUpload): Promise<GalleryItem> {
    const formData = new FormData();
    formData.append('title', upload.title);
    formData.append('category', upload.category);
    formData.append('description', upload.description || '');
    formData.append('file', upload.file);

    const res = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to create gallery item');
    return res.json();
  }

  /**
   * Update an existing gallery image (optional for future)
   */
  static async update(
    id: string,
    updates: Partial<Omit<GalleryItem, 'id' | 'created_at'>>
  ): Promise<GalleryItem> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error('Failed to update gallery item');
    return res.json();
  }

  /**
   * Delete a gallery image
   */
  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  }

  /**
   * Get count of images by category
   */
  static async getCountByCategory(): Promise<Record<string, number>> {
    const items = await this.getAll();
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }
}
