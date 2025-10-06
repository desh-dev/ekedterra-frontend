'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { compressImage, isImageFile } from '@/lib/image-utils';

export function ImageCompressionTest() {
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      alert('Please select an image file');
      return;
    }

    setIsLoading(true);
    setOriginalSize(file.size);
    setCompressedSize(null);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const compressedFile = await compressImage(file);
      setCompressedSize(compressedFile.size);
      
      // Show compressed preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress image');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return 'N/A';
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getCompressionRatio = () => {
    if (!originalSize || !compressedSize) return 'N/A';
    return `${((1 - compressedSize / originalSize) * 100).toFixed(2)}% smaller`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Compression Test</h1>
      
      <div className="mb-4">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        <label
          htmlFor="image-upload"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Select Image'}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Original Image</h2>
          <p>Size: {formatFileSize(originalSize)}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Compressed Image</h2>
          <p>Size: {formatFileSize(compressedSize)}</p>
          <p className="text-green-600">{getCompressionRatio()}</p>
        </div>
      </div>

      {previewUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="max-w-full h-64 overflow-hidden border rounded">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
