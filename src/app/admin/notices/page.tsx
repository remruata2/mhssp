'use client';

import { useState, useEffect } from 'react';
import { FaFilePdf, FaEdit, FaTrash, FaFolder, FaCalendar, FaUpload, FaLink } from 'react-icons/fa';

interface Notice {
  _id: string;
  title: string;
  type: 'document' | 'url';
  documentUrl?: string;
  url?: string;
  category: string;
  publishDate: string;
  isPublished: boolean;
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    documentUrl: '',
    url: '',
    category: '',
    isPublished: false,
    publishDate: new Date().toISOString().split('T')[0],
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.data || []);
      } else {
        setError('Failed to fetch notices');
        console.error('Error fetching notices:', data);
      }
    } catch (error) {
      setError('Failed to fetch notices');
      console.error('Error fetching notices:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should not exceed 10MB');
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // Validate based on notice type
      if (formData.type === 'document' && !isEditing && !pdfFile) {
        throw new Error('Please upload a PDF file');
      }
      if (formData.type === 'url' && !formData.url) {
        throw new Error('Please enter a URL');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isPublished', String(formData.isPublished));
      formDataToSend.append('publishDate', formData.publishDate);
      
      if (pdfFile) {
        formDataToSend.append('document', pdfFile);
      }

      if (formData.type === 'url') {
        formDataToSend.append('url', formData.url);
      }

      const url = isEditing ? `/api/notices/${editingId}` : '/api/notices';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save notice');
      }

      setSuccessMessage(isEditing ? 'Notice updated successfully!' : 'Notice added successfully!');
      resetForm();
      fetchNotices();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error saving notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    setIsEditing(true);
    setEditingId(notice._id);
    
    // Format date for the input field (YYYY-MM-DD)
    const date = new Date(notice.publishDate);
    const formattedDate = date.toISOString().split('T')[0];
    
    setFormData({
      title: notice.title,
      type: notice.type,
      documentUrl: notice.documentUrl,
      url: notice.url,
      category: notice.category,
      isPublished: notice.isPublished,
      publishDate: formattedDate,
    });
    setPdfFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notice');
      }

      fetchNotices();
      setSuccessMessage('Notice deleted successfully!');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError('Failed to delete notice');
      console.error('Error deleting notice:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'document',
      documentUrl: '',
      url: '',
      category: '',
      isPublished: false,
      publishDate: new Date().toISOString().split('T')[0],
    });
    setPdfFile(null);
    setIsEditing(false);
    setEditingId('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Notices</h1>
      </div>

      <div className="flex gap-6">
        {/* Notices List - Left Side */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Notices List</h2>
          {isLoading && !isEditing ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-gray-500 text-center p-4">No notices found</div>
          ) : (
            <div className="space-y-4">
              {notices.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        {item.type === 'document' ? (
                          <FaFilePdf className="h-4 w-4" />
                        ) : (
                          <FaLink className="h-4 w-4" />
                        )}
                        <a href={item.type === 'document' ? item.documentUrl : item.url} target="_blank" rel="noopener noreferrer" className="text-sm">
                          {item.type === 'document' ? 'View Document' : 'View URL'}
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-2">
                      <FaFolder className="h-4 w-4" />
                      {item.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendar className="h-4 w-4" />
                      {new Date(item.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notice Form - Right Side */}
        <div className="w-[400px] bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Notice' : 'Add Notice'}
          </h2>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minLength={3}
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.title || '').length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="document">Document</option>
                <option value="url">URL</option>
              </select>
            </div>

            {formData.type === 'document' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="pdf"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {pdfFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {pdfFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter URL (e.g., /pages/about or https://example.com)"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can enter a local path (e.g., /pages/about) or a full URL (e.g., https://example.com)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="General">General</option>
                <option value="Important">Important</option>
                <option value="Announcement">Announcement</option>
                <option value="Tender">Tender</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  <>{isEditing ? 'Update' : 'Add'} Notice</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
