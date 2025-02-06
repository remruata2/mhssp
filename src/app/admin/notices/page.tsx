"use client";

import { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendar,
  FaUpload,
  FaLink,
} from "react-icons/fa";
import SlideOver from "@/components/SlideOver";
import { Notice, SubNotice, SubNoticeFormData } from "@/types/notice";

interface FormData {
  title: string;
  type: "document" | "url" | "subNotices";
  documentUrl?: string;
  url?: string;
  isPublished: boolean;
  publishDate: string;
}

const initialFormData: FormData = {
  title: "",
  type: "document",
  documentUrl: "",
  url: "",
  isPublished: false,
  publishDate: new Date().toISOString().split("T")[0],
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [subNoticesFormData, setSubNoticesFormData] = useState<
    SubNoticeFormData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const addSubNoticeField = () => {
    setSubNoticesFormData([
      ...subNoticesFormData,
      { id: "", title: "", documentUrl: "", file: null },
    ]);
  };

  const removeSubNoticeField = (index: number) => {
    setSubNoticesFormData(subNoticesFormData.filter((_, i) => i !== index));
  };

  const updateSubNoticeField = (
    index: number,
    field: keyof SubNoticeFormData,
    value: string | File | null
  ) => {
    const updatedFormData = [...subNoticesFormData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [field]: value,
    };
    setSubNoticesFormData(updatedFormData);
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/admin/notices");
      const data = await response.json();
      if (data.success) {
        setNotices(data.data);
        setFilteredNotices(data.data);
      } else {
        setError("Failed to fetch notices");
        console.error("Error fetching notices:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching notices:", errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const filterNotices = () => {
      let filtered = [...notices];

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter((notice) =>
          notice.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply date filter
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filtered = filtered.filter((notice) => {
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

  const handleEdit = (notice: Notice) => {
    setIsEditing(true);
    setEditingId(notice._id);

    // Format the date to YYYY-MM-DD for the input field
    const formattedDate = new Date(notice.publishDate)
      .toISOString()
      .split("T")[0];

    setFormData({
      title: notice.title,
      type: notice.type,
      documentUrl: notice.documentUrl || "",
      url: notice.url || "",
      isPublished: notice.isPublished,
      publishDate: formattedDate,
    });

    // Initialize subNoticesFormData when editing
    if (notice.type === "subNotices") {
      fetch(`/api/notices/${notice._id}/subnotices`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Sort subNotices by order field
            const sortedSubNotices = [...data.data].sort(
              (a: SubNotice, b: SubNotice) => a.order - b.order
            );

            setSubNoticesFormData(
              sortedSubNotices.map((subNotice: SubNotice) => ({
                id: subNotice._id,
                title: subNotice.title,
                documentUrl: subNotice.documentUrl,
                file: null,
              }))
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching sub notices:", error);
          setSubNoticesFormData([]);
        });
    } else {
      setSubNoticesFormData([]);
    }

    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size should not exceed 10MB");
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear file and URLs when changing type
      if (name === "type") {
        setPdfFile(null);
        if (value !== "subNotices") {
          setSubNoticesFormData([]);
        }
        if (value === "document") {
          setFormData((prev) => ({ ...prev, url: "" }));
        } else if (value === "url") {
          setFormData((prev) => ({ ...prev, documentUrl: "" }));
        } else {
          setFormData((prev) => ({ ...prev, documentUrl: "", url: "" }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Please enter a title");
      }

      // Ensure subNoticesFormData is initialized
      const currentSubNotices = subNoticesFormData || [];

      // Validate based on type
      if (formData.type === "document") {
        if (!isEditing) {
          if (!pdfFile) {
            throw new Error("Please upload a PDF file");
          }
        } else if (!formData.documentUrl && !pdfFile) {
          throw new Error(
            "Please either provide a document URL or upload a PDF file"
          );
        }
      } else if (formData.type === "url" && !formData.url) {
        throw new Error("Please enter a URL");
      } else if (
        formData.type === "subNotices" &&
        currentSubNotices.length === 0
      ) {
        throw new Error("Please add at least one sub notice");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("isPublished", String(formData.isPublished));
      formDataToSend.append("publishDate", formData.publishDate);

      if (formData.type === "document") {
        if (pdfFile) {
          formDataToSend.append("document", pdfFile);
        } else if (formData.documentUrl) {
          formDataToSend.append("documentUrl", formData.documentUrl);
        }
      } else if (formData.type === "url" && formData.url) {
        formDataToSend.append("url", formData.url);
      }

      // Handle sub notices
      if (formData.type === "subNotices" && currentSubNotices.length > 0) {
        currentSubNotices.forEach((subNotice, index) => {
          formDataToSend.append(`subNotices[${index}][id]`, subNotice.id || '');
          formDataToSend.append(`subNotices[${index}][title]`, subNotice.title);
          if (subNotice.file) {
            formDataToSend.append(`subNotices[${index}][file]`, subNotice.file);
          }
          if (subNotice.documentUrl) {
            formDataToSend.append(
              `subNotices[${index}][documentUrl]`,
              subNotice.documentUrl
            );
          }
        });
      }

      const url = isEditing ? `/api/notices/${editingId}` : "/api/notices";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save notice");
      }

      setSuccessMessage(
        isEditing
          ? "Notice updated successfully!"
          : "Notice added successfully!"
      );
      setFormData(initialFormData);
      setPdfFile(null);
      setSubNoticesFormData([]);
      setIsEditing(false);
      setEditingId("");
      fetchNotices();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      console.error("Error submitting notice:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notice");
      }

      fetchNotices();
      setSuccessMessage("Notice deleted successfully!");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error deleting notice:", errorMessage);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPdfFile(null);
    setIsEditing(false);
    setEditingId("");
    setSubNoticesFormData([]); // Clear sub notices
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div
          className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md"
          role="alert"
        >
          <span className="block">{error}</span>
        </div>
      )}
      {successMessage && (
        <div
          className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md"
          role="alert"
        >
          <span className="block">{successMessage}</span>
        </div>
      )}
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
          <div className="p-4">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
                  onClick={() => setDateFilter("")}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Date
                </button>
              )}
            </div>

            {isLoading && !isEditing ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredNotices.length === 0 ? (
              <div className="text-gray-500 text-center p-4">
                No notices found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotices.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            {item.type !== "subNotices" && (
                              <a
                                href={
                                  item.type === "document"
                                    ? item.documentUrl
                                    : item.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-1"
                              >
                                {item.type === "document" ? (
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
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {item.type === "document" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FaFilePdf className="mr-1 h-3 w-3" /> PDF
                                Document
                              </span>
                            ) : item.type === "url" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaLink className="mr-1 h-3 w-3" /> External URL
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <FaFilePdf className="mr-1 h-3 w-3" /> Multiple
                                Documents
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendar className="h-4 w-4 mr-2" />
                            {new Date(item.publishDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="h-4 w-4" />
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
                maxLength={250}
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.title || "").length}/250 characters
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
              >
                <option value="document">PDF Document</option>
                <option value="url">External URL</option>
                <option value="subNotices">Multiple Documents</option>
              </select>
            </div>

            {formData.type === "document" && (
              <div>
                <label className="form-label">Document</label>
                <div className="mt-1 space-y-2">
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
                      Accepts direct PDF URLs or Google Drive document links
                      (e.g., https://drive.google.com/file/d/...)
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
            )}

            {formData.type === "url" && (
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

            {formData.type === "subNotices" && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sub Notices
                    </h3>
                    <button
                      type="button"
                      onClick={addSubNoticeField}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Add Sub Notice
                    </button>
                  </div>

                  {subNoticesFormData.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Click `&quot;Add Sub Notice&quot; to add documents to this
                      notice.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {subNoticesFormData.map((subNotice, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              Sub Notice {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeSubNoticeField(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="form-label">Title</label>
                              <input
                                type="text"
                                value={subNotice.title}
                                onChange={(e) =>
                                  updateSubNoticeField(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="form-input"
                                placeholder="Enter sub notice title"
                                required
                              />
                            </div>

                            <div>
                              <label className="form-label">Document</label>
                              <div className="mt-1 space-y-2">
                                <div className="flex items-center space-x-4">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        updateSubNoticeField(
                                          index,
                                          "file",
                                          file
                                        );
                                        updateSubNoticeField(
                                          index,
                                          "documentUrl",
                                          ""
                                        );
                                      }
                                    }}
                                    className="form-input"
                                  />
                                  <span className="text-sm text-gray-500">
                                    or
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <input
                                    type="text"
                                    value={subNotice.documentUrl}
                                    onChange={(e) =>
                                      updateSubNoticeField(
                                        index,
                                        "documentUrl",
                                        e.target.value
                                      )
                                    }
                                    className="form-input"
                                    placeholder="Enter document URL"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              <label
                htmlFor="isPublished"
                className="ml-2 block text-sm text-gray-700"
              >
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
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditing ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <>{isEditing ? "Update" : "Add"} Notice</>
                )}
              </button>
            </div>
          </form>
        </SlideOver>
      </div>
    </div>
  );
}
