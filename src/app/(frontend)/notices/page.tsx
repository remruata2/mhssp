'use client';

import { useState, useEffect } from 'react';
import { Notice } from '@/types/notice';
import NoticeComponent from '@/components/Notice';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices');
        const data = await response.json();
        if (data.success) {
          setNotices(data.data);
          setFilteredNotices(data.data);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    const filterNotices = () => {
      let filtered = [...notices];

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(notice =>
          notice.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply date filter
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filtered = filtered.filter(notice => {
          const noticeDate = new Date(notice.publishDate);
          return (
            noticeDate.getFullYear() === filterDate.getFullYear() &&
            noticeDate.getMonth() === filterDate.getMonth() &&
            noticeDate.getDate() === filterDate.getDate()
          );
        });
      }

      setFilteredNotices(filtered);
    };

    filterNotices();
  }, [notices, searchQuery, dateFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Notice Board" 
        subtitle="Important notices and announcements from MHSSP"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Notices</h1>
              
              {/* Search and Filter Section */}
              <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search notices by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:w-48">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
                  >
                    Clear Date
                  </button>
                )}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No notices found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredNotices.map((notice) => (
                    <NoticeComponent key={notice._id} notice={notice} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
