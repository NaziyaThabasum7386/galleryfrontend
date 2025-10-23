// src/services/GalleryService.ts
import type { GalleryItem, GalleryUpload } from '../types/gallery';

const STORAGE_KEY = 'gallery_items';

export class GalleryService {
  /**
   * Fetch all gallery images, optionally filtered by category
   */
  static async getAll(category?: string): Promise<GalleryItem[]> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];

    if (category && category !== 'All Categories') {
      return items.filter(item => item.category === category);
    }

    return items.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Get a single gallery image by ID
   */
  static async getById(id: string): Promise<GalleryItem | null> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];
    return items.find(item => item.id === id) || null;
  }

  /**
   * "Upload" image (store locally using object URL)
   */
  static async uploadImage(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file); // store as Base64 for simplicity
    });
  }

  /**
   * Create a new gallery image entry
   */
  static async create(upload: GalleryUpload): Promise<GalleryItem> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];

    const imageUrl = await this.uploadImage(upload.file);
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title: upload.title,
      category: upload.category,
      description: upload.description || '',
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    items.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    return newItem;
  }

  /**
   * Update an existing gallery image
   */
  static async update(
    id: string,
    updates: Partial<Omit<GalleryItem, 'id' | 'created_at'>>
  ): Promise<GalleryItem> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];
    const index = items.findIndex(item => item.id === id);

    if (index === -1) throw new Error('Item not found');

    items[index] = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  /**
   * Delete a gallery image
   */
  static async delete(id: string): Promise<void> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];
    const updated = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  /**
   * Get count of images by category
   */
  static async getCountByCategory(): Promise<Record<string, number>> {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GalleryItem[];

    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return counts;
  }
}
