'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaCalendarAlt } from 'react-icons/fa';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  publishDate: string;
  category: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data.data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group news by date
  const groupedNews = news.reduce((groups: { [key: string]: NewsItem[] }, item) => {
    const date = new Date(item.publishDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedNews).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-900">
              <FaCalendarAlt className="text-blue-600" />
              <h3 className="text-lg font-semibold">{date}</h3>
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-blue-100">
              {groupedNews[date].map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                  <p className="mt-2 text-gray-600">{item.content}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800`}>
                      <FaNewspaper className="mr-1" />
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
