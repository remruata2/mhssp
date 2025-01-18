'use client';

import News from '@/components/News';
import { motion } from 'framer-motion';
import PageTitle from '@/components/ui/PageTitle';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Latest News" 
        subtitle="Stay updated with the latest news and announcements"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <div className="max-w-6xl mx-auto">
            <News />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
