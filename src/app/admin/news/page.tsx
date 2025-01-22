'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SlideOver from '@/components/SlideOver';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  isPublished: boolean;
  publishDate: string;
}

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublished: false,
    publishDate: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      // Validate title length
      if (formData.title.length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }
      if (formData.title.length > 100) {
        throw new Error('Title cannot exceed 100 characters');
      }

      // Validate content length
      if (formData.content.length < 10) {
        throw new Error('Content must be at least 10 characters long');
      }
      if (formData.content.length > 1000) {
        throw new Error('Content cannot exceed 1000 characters');
      }

      const url = isEditing ? `/api/news/${editingId}` : '/api/news';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(isEditing ? 'News updated successfully!' : 'News added successfully!');
        resetForm();
        fetchNews();
        setIsModalOpen(false);
      } else {
        throw new Error(data.message || 'Failed to save news');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setFormData({
      title: item.title,
      content: item.content,
      isPublished: item.isPublished,
      publishDate: new Date(item.publishDate).toISOString().split('T')[0]
    });
    setIsEditing(true);
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchNews();
      } else {
        setError(data.error || 'Failed to delete news');
      }
    } catch (error) {
      setError('Failed to delete news');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      isPublished: false,
      publishDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setEditingId('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage News</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Add News
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="relative group">
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {truncateText(item.content)}
                      </p>
                      {item.content.length > 150 && (
                        <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white p-4 rounded-md shadow-lg max-w-lg whitespace-pre-wrap">
                          {item.content}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.publishDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    title="Edit"
                  >
                    <FaEdit className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FaTrash className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver
        title={isEditing ? "Edit News" : "Add News"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
              minLength={3}
              maxLength={100}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="form-label">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="form-textarea"
              required
              minLength={10}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.content.length}/1000 characters
            </p>
          </div>

          <div>
            <label htmlFor="publishDate" className="form-label">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
