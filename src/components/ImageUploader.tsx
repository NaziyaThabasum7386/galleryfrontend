import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { GalleryService } from '../services/galleryService';
import type { GalleryUpload } from '../types/gallery';

const categories: string[] = [
  'Events',
  'Causes',
  'Volunteers',
  'Fundraising',
  'Community',
  'Environment',
  'Healthcare',
  'Team'
];

export default function ImageUploader(): JSX.Element {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) &&
        file.size <= 10 * 1024 * 1024
    );
    setSelectedFiles(validFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) &&
        file.size <= 10 * 1024 * 1024
    );
    setSelectedFiles(validFiles);
  };

  const handleUpload = async (): Promise<void> => {
    if (!category || selectedFiles.length === 0) {
      alert('Please select files and a category.');
      return;
    }

    try {
      setUploading(true);

      const uploads: GalleryUpload[] = selectedFiles.map((file) => ({
        title: file.name.replace(/\.[^/.]+$/, ''),
        category,
        description,
        file
      }));

      await GalleryService.createBatch(uploads);

      alert(`Successfully uploaded ${selectedFiles.length} image(s)!`);
      setSelectedFiles([]);
      setCategory('');
      setDescription('');

      navigate('/gallery-management');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

      <div
        className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.png,.gif"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
          disabled={uploading}
        />

        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600">Drop images here or click to browse</p>
            <p className="text-sm text-gray-400">
              Supports JPG, PNG, GIF up to 10MB each
            </p>
            <div className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Select Files
            </div>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">Selected Files:</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {selectedFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <label className="block font-medium mb-2">Category Tag</label>
        <Select value={category} onValueChange={setCategory} disabled={uploading}>
          <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-2">Description (Optional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for these images..."
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={uploading}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Link to="/gallery-management">
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            disabled={uploading}
          >
            ← Back to Gallery
          </Button>
        </Link>
        <div className="flex gap-3">
          <Link to="/">
            <Button
              variant="outline"
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              disabled={uploading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            disabled={uploading || !category || selectedFiles.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Uploading...
              </>
            ) : (
              'Upload Images'
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm text-gray-700">
        <p className="font-semibold mb-1">Upload Tips</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use high-quality images for better gallery presentation</li>
          <li>Add descriptive categories to help organize your gallery</li>
          <li>Maximum file size: 10MB per image</li>
          <li>Supported formats: JPG, PNG, GIF</li>
        </ul>
      </div>
    </div>
  );
}
