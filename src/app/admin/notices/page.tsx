'use client';

import { useState, useEffect } from 'react';
import { FaFilePdf, FaEdit, FaTrash, FaPlus, FaCalendar, FaUpload, FaLink } from 'react-icons/fa';
import SlideOver from '@/components/SlideOver';

interface Notice {
  _id: string;
  title: string;
  type: 'document' | 'url';
  documentUrl: string;
  url: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    documentUrl: '',
    url: '',
    isPublished: false,
    publishDate: new Date().toISOString().split('T')[0],
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
      if (formData.type === 'document') {
        if (!isEditing && !pdfFile && !formData.documentUrl) {
          throw new Error('Please either upload a PDF file or provide a document URL');
        }
        if (formData.documentUrl) {
          // Allow Google Drive URLs and direct PDF URLs
          const isValidUrl = formData.documentUrl.match(/^https?:\/\//i) && (
            formData.documentUrl.match(/\.pdf$/i) ||
            formData.documentUrl.match(/drive\.google\.com.*\/file\/d\/.*\/view/i) ||
            formData.documentUrl.match(/docs\.google\.com.*\/document\/d\/.*\/edit/i)
          );
          if (!isValidUrl) {
            throw new Error('Please enter a valid document URL (PDF or Google Drive document)');
          }
        }
      } else if (formData.type === 'url' && !formData.url) {
        throw new Error('Please enter a URL');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('isPublished', String(formData.isPublished));
      formDataToSend.append('publishDate', formData.publishDate);

      if (formData.type === 'document') {
        // If we have a file, append it
        if (pdfFile) {
          formDataToSend.append('pdf', pdfFile);
        }
        // If we have a document URL, append it
        if (formData.documentUrl) {
          formDataToSend.append('documentUrl', formData.documentUrl);
        }
      } else {
        formDataToSend.append('url', formData.url);
      }

      const url = isEditing ? `/api/notices/${editingId}` : '/api/notices';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save notice');
      }

      setSuccessMessage(isEditing ? 'Notice updated successfully!' : 'Notice added successfully!');
      setFormData({
        title: '',
        type: 'document',
        documentUrl: '',
        url: '',
        isPublished: false,
        publishDate: new Date().toISOString().split('T')[0],
      });
      setPdfFile(null);
      setIsEditing(false);
      setEditingId('');
      fetchNotices();

    } catch (err: any) {
      setError(err.message);
      console.error('Error submitting notice:', err);
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
      isPublished: notice.isPublished,
      publishDate: formattedDate,
    });
    setPdfFile(null);
    setIsModalOpen(true);
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
        <button
           onClick={() => {
            setIsModalOpen(true);
            resetForm();
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Add Notices
        </button>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  {notices.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <a 
                            href={item.type === 'document' ? item.documentUrl : item.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-1"
                          >
                            {item.type === 'document' ? (
                              <>
                                <FaFilePdf className="h-4 w-4" />
                                View Document
                              </>
                            ) : (
                              <>
                                <FaLink className="h-4 w-4" />
                                View URL
                              </>
                            )}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {item.type === 'document' ? 'PDF Document' : 'External URL'}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendar className="h-4 w-4 mr-2" />
                          {new Date(item.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notice Form - Right Side */}
        <SlideOver
          title={isEditing ? "Edit Notice" : "Add Notice"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                minLength={3}
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.title || '').length}/100 characters
              </p>
            </div>

            <div>
              <label className="form-label">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="document">Document</option>
                <option value="url">URL</option>
              </select>
            </div>

            {formData.type === 'document' ? (
              <>
                <div>
                  <label className="form-label">
                    Document Source <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col space-y-4">
                    {/* Document URL Input */}
                    <div>
                      <label className="form-label text-sm text-gray-600">
                        Document URL
                      </label>
                      <input
                        type="url"
                        name="documentUrl"
                        value={formData.documentUrl}
                        onChange={handleChange}
                        placeholder="Enter PDF URL or Google Drive document link"
                        className="form-input"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Accepts direct PDF URLs or Google Drive document links (e.g., https://drive.google.com/file/d/...)
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="form-label text-sm text-gray-600">
                        Upload PDF File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
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
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Either provide a document URL or upload a PDF file
                  </p>
                </div>
              </>
            ) : (
              <div>
                <label className="form-label">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="https://example.com"
                />
              </div>
            )}

            <div>
              <label className="form-label">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
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
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
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
        </SlideOver>

        
      </div>
    </div>
  );
}
