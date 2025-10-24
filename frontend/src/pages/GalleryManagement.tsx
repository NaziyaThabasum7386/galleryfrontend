import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Upload, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import GalleryGrid from '../components/GalleryGrid';
import { GalleryService } from '../services/GalleryService';
import type { GalleryItem, GalleryCategory } from '../types/gallery';

const categories: GalleryCategory[] = [
  'All Categories',
  'Events',
  'Causes',
  'Volunteers',
  'Community',
  'Environment',
  'Healthcare',
  'Fundraising',
  'Team'
];

export default function GalleryManagement(): JSX.Element {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState<GalleryCategory>('All Categories');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const items = await GalleryService.getAll();

      // filter by category if not "All Categories"
      const filtered =
        category === 'All Categories'
          ? items
          : items.filter(item => item.category === category);

      setGalleryItems(filtered);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to load gallery images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [category]);

  const handleDelete = async (id: string): Promise<void> => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      await GalleryService.delete(id);
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  const totalImages = galleryItems.length;

  return (
    <div className="flex-grow flex-1 w-full bg-gray-50 p-6">
      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
        <Link to="/dashboard" className="hover:underline hover:text-gray-700">
          Dashboard
        </Link>
        <ChevronRight className="text-gray-400 text-base" />
        <span className="text-gray-700 font-medium">Gallery Management</span>
      </div>

      <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Gallery</h1>
          <p className="text-slate-500 text-base">Upload and manage gallery images</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <Link to="/gallery-upload">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition">
              <Upload className="text-sm" />
              Upload New Images
            </Button>
          </Link>

          <Select value={category} onValueChange={(value) => setCategory(value as GalleryCategory)}>
            <SelectTrigger className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm font-medium w-fit">
          Total Images: {totalImages}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          <span className="ml-3 text-gray-600">Loading gallery...</span>
        </div>
      ) : (
        <GalleryGrid items={galleryItems} onDelete={handleDelete} />
      )}
    </div>
  );
}
