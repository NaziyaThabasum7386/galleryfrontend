import { Trash2, Calendar, Tag, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GalleryItem } from '../types/gallery';

interface GalleryCardProps extends GalleryItem {
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function GalleryCard({
  id,
  title,
  category,
  image_url,
  created_at,
  description,
  onDelete,
  onEdit
}: GalleryCardProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Events': return 'bg-purple-100 text-purple-800';
      case 'Causes': return 'bg-green-100 text-green-800';
      case 'Volunteers': return 'bg-blue-100 text-blue-800';
      case 'Community': return 'bg-yellow-100 text-yellow-800';
      case 'Healthcare': return 'bg-red-100 text-red-800';
      case 'Environment': return 'bg-green-100 text-green-800';
      case 'Team': return 'bg-orange-100 text-orange-800';
      case 'Fundraising': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden group">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Edit/Delete icons on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition duration-300">
          {/* Edit button */}
           <Link to="/gallery-upload">
          <button
            className="bg-white p-2 rounded-full hover:bg-blue-100"
            title="Edit"
          >
            <Edit3 className="text-blue-600 w-5 h-5" />
          </button>
           </Link>

          {/* Delete button */}
          <button
            onClick={() => onDelete(id)}
            className="bg-white p-2 rounded-full hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="text-red-600 w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Tag className="w-4 h-4" />
          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(created_at)}</span>
        </div>
      </div>
    </div>
  );
}
