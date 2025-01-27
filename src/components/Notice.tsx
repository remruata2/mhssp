'use client';

import { useState, useEffect } from 'react';
import { FaFilePdf, FaCalendarAlt, FaLink, FaChevronRight } from 'react-icons/fa';
import { Notice, SubNotice } from '@/types/notice';

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
        if (!response.ok) {
          throw new Error('Failed to fetch sub notices');
        }
        const data = await response.json();
        if (data.success) {
          setSubNotices(data.data);
        } else {
          setError(data.error || 'Error fetching sub notices');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
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

export default function NoticeComponent({ notice }: NoticeProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{notice.title}</h3>
      
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FaCalendarAlt className="mr-2" />
        {formatDate(notice.publishDate)}
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
