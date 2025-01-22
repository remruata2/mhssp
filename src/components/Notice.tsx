'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaCalendarAlt, FaLink} from 'react-icons/fa';

interface Notice {
  _id: string;
  title: string;
  publishDate: string;
  type: 'document' | 'url';
  documentUrl?: string;
  url?: string;
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('NoticeBoard component mounted');
    const fetchNotices = async () => {
      console.log('Fetching notices...');
      try {
        const response = await fetch('/api/notices');
        const data = await response.json();
        console.log('Notices fetched:', data);
        setNotices(data.data || []);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchNotices();
  }, []);

  console.log('Rendering NoticeBoard component');

  if (loading) {
    console.log('Loading notices...');
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

  // Group notices by date
  const groupedNotices = notices.reduce((groups: { [key: string]: Notice[] }, item) => {
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
  const sortedDates = Object.keys(groupedNotices).sort((a, b) => 
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
              {groupedNotices[date].map((notice, index) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      {notice.type === 'url' ? (
                        <div className='flex items-start space-x-3'>
                          <FaLink className='text-blue-600 mt-1 flex-shrink-0' />
                          <a 
                            href={notice.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-blue-600 hover:text-blue-800"
                          >
                            {notice.title}
                          </a>
                        </div>
                      ) : (
                        <div className='flex items-start space-x-3'>
                          <FaFilePdf className='text-red-600 mt-1 flex-shrink-0' />
                          <h4 className="text-lg font-medium text-gray-900">{notice.title}</h4>
                        </div>
                      )}
                    </div>
                    {notice.type === 'document' && (
                      <a
                        href={notice.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <FaDownload />
                        <span>Download</span>
                      </a>
                    )}
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
