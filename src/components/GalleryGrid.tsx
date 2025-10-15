import type { GalleryItem } from '../types/gallery';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
}

export default function GalleryGrid({ items, onDelete }: GalleryGridProps): JSX.Element {
  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No images found. Upload some images to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded">
      {items.map((item) => (
        <GalleryCard key={item.id} {...item} onDelete={() => onDelete(item.id)} />
      ))}
    </div>
  );
}
