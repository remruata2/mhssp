"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import Image from 'next/image';

interface NewsItem {
	_id: string;
	title: string;
	content: string;
	publishDate: string;
	images: string[];
}

interface ImageModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, title, onClose }: ImageModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 m-4 text-white hover:text-gray-300"
      >
        <FaTimes className="w-6 h-6" />
      </button>
      <Image
        src={imageUrl}
        alt={title}
        width={1200}
        height={800}
        className="max-h-[80vh] w-auto object-contain"
      />
    </div>
  </motion.div>
);

export default function News({ children }: { children: ({ items }: { items: NewsItem[] }) => React.ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNewsItems(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      {children({ items: newsItems })}
      
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage.url}
            title={selectedImage.title}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
