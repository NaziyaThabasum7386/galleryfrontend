import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

export default function GalleryUpload(): JSX.Element {
  return (
    <div className="flex-grow flex-1 w-full bg-gray-100">
      <div className="p-6 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <ChevronRight className="text-gray-500 text-xl" />
            <Link to="/gallery-management" className="text-gray-500 hover:text-gray-700">
              Gallery Management
            </Link>
            <ChevronRight className="text-gray-500 text-xl" />
            <span className="text-black">Gallery Upload</span>
          </div>

          <div className="min-h-screen bg-gray-100 p-6">
            <ImageUploader />
          </div>
        </div>
      </div>
    </div>
  );
}
