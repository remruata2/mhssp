'use client';

import { useState, useRef } from 'react';

interface ImageInsertModalProps {
  onClose: () => void;
  onInsert: (imageUrl: string) => void;
}

export default function ImageInsertModal({ onClose, onInsert }: ImageInsertModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUrlSubmit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (imageUrl) {
      onInsert(imageUrl);
      onClose();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your server endpoint
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onInsert(data.url); // The server should return the URL of the uploaded image
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal">
        <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
        
        {/* URL Input */}
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
              placeholder="Enter image URL or /images/your-image.jpg for public images"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="text-sm text-gray-600 mb-4">
            For images in public folder, use: /images/your-image.jpg
          </div>
          <button
            onClick={handleUrlSubmit}
            disabled={!imageUrl}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            Insert from URL
          </button>
        </div>

        {/* File Upload */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload from Computer</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
