'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
  hash?: string;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
}

export default function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newImages: UploadedImage[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    });
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    onImagesChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Upload className="h-12 w-12 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your images here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse from your computer
            </p>
          </div>
          <label className="cursor-pointer">
            <span className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block">
              Choose Files
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, GIF, WebP (Max 10MB each)
          </p>
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Uploaded Images ({images.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">{image.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}