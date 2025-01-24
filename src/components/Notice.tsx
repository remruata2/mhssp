'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaCalendarAlt, FaLink, FaChevronRight } from 'react-icons/fa';

interface SubNotice {
  _id: string;
  title: string;
  documentUrl: string;
}

interface Notice {
  _id: string;
  title: string;
  publishDate: string;
  type: 'document' | 'url' | 'subNotices';
  documentUrl?: string;
  url?: string;
  isPublished: boolean;
}

interface NoticeProps {
  notice: Notice;
}

const SubNoticesList = ({ noticeId }: { noticeId: string }) => {
  const [subNotices, setSubNotices] = useState<SubNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubNotices = async () => {
      try {
        const response = await fetch(`/api/notices/${noticeId}/subnotices`);
        const data = await response.json();
        if (data.success) {
          setSubNotices(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch sub notices');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching sub notices:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubNotices();
  }, [noticeId]);

  if (loading) return <div className="text-sm text-gray-500 pl-8">Loading sub notices...</div>;
  if (error) return <div className="text-sm text-red-500 pl-8">{error}</div>;

  return (
    <div className="mt-4 space-y-2">
      {subNotices.map((subNotice) => (
        <div key={subNotice._id} className="flex items-center pl-8 space-x-2">
          <FaChevronRight className="text-gray-400 h-3 w-3" />
          <a
            href={subNotice.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md text-blue-600 hover:text-blue-800 hover:underline"
          >
            {subNotice.title}
          </a>
        </div>
      ))}
    </div>
  );
};

const NoticeBoard = ({ notice }: NoticeProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{notice.title}</h3>
      
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FaCalendarAlt className="mr-2" />
        {new Date(notice.publishDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      {notice.type === 'subNotices' ? (
        <SubNoticesList noticeId={notice._id} />
      ) : (
        <a
          href={notice.type === 'document' ? notice.documentUrl : notice.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          {notice.type === 'document' ? (
            <>
              <FaFilePdf className="mr-2" />
              View Document
            </>
          ) : (
            <>
              <FaLink className="mr-2" />
              View Link
            </>
          )}
        </a>
      )}
    </div>
  );
};

export default NoticeBoard;
