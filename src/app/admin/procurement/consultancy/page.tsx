'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SearchAndFilter from '@/components/SearchAndFilter';
import Pagination from '@/components/Pagination';
import SlideOver from '@/components/SlideOver';

interface Contractor {
  _id: string;
  name: string;
}

interface ConsultancyProcurement {
  _id: string;
  contractBidNo: string;
  consultancyServices: string;
  contractSigned: string;
  contractor: Contractor;
  createdAt: string;
}

export default function ConsultancyPage() {
  const [consultancies, setConsultancies] = useState<ConsultancyProcurement[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    contractBidNo: '',
    consultancyServices: '',
    contractSigned: '',
    contractor: '',
  });

  useEffect(() => {
    fetchConsultancies();
    fetchContractors();
  }, []);

  async function fetchContractors() {
    try {
      const response = await fetch('/api/procurement/contractors');
      const data = await response.json();
      if (data.success) {
        setContractors(data.data);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  }

  async function fetchConsultancies() {
    try {
      setLoading(true);
      const response = await fetch('/api/procurement/consultancy');
      const data = await response.json();
      if (data.success) {
        setConsultancies(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to fetch consultancies');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Find the selected contractor to get its name
      const selectedContractor = contractors.find(c => c._id === formData.contractor);
      if (!selectedContractor) {
        setError('Please select a contractor');
        setLoading(false);
        return;
      }

      const consultancyData = {
        ...formData,
        contractor: selectedContractor._id,
      };

      const url = isEditing ? `/api/procurement/consultancy/${editingId}` : '/api/procurement/consultancy';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultancyData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(isEditing ? 'Consultancy updated successfully!' : 'Consultancy added successfully!');
        resetForm();
        fetchConsultancies();
        setIsModalOpen(false);
      } else {
        setError(data.error || 'Failed to save consultancy');
      }
    } catch (error) {
      setError('Failed to save consultancy');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this consultancy? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/consultancy/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Consultancy deleted successfully!');
        setConsultancies(consultancies.filter(c => c._id !== id));
      } else {
        setError(data.error || 'Failed to delete consultancy');
      }
    } catch (error) {
      setError('Failed to delete consultancy');
    }
  }

  const handleEdit = (consultancy: ConsultancyProcurement) => {
    setFormData({
      contractBidNo: consultancy.contractBidNo,
      consultancyServices: consultancy.consultancyServices,
      contractSigned: new Date(consultancy.contractSigned).toISOString().split('T')[0],
      contractor: consultancy.contractor._id,
    });
    setIsEditing(true);
    setEditingId(consultancy._id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      contractBidNo: '',
      consultancyServices: '',
      contractSigned: '',
      contractor: '',
    });
    setIsEditing(false);
    setEditingId('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter consultancies based on search term
  const filteredConsultancies = consultancies.filter((consultancy) => {
    const searchString = searchTerm.toLowerCase();
    return (
      consultancy.contractBidNo.toLowerCase().includes(searchString) ||
      consultancy.consultancyServices.toLowerCase().includes(searchString) ||
      consultancy.contractor?.name.toLowerCase().includes(searchString)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredConsultancies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultancies = filteredConsultancies.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading && consultancies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consultancy Procurements</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Add Consultancy
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

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by contract no, services, or contractor..."
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract/Bid No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultancy Services
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract Signed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Contractor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentConsultancies.map((consultancy) => (
              <tr key={consultancy._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {consultancy.contractBidNo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {consultancy.consultancyServices}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(consultancy.contractSigned).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-48 truncate">
                  {consultancy.contractor?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(consultancy)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(consultancy._id)}
                      className="text-red-600 hover:text-red-900"
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

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <SlideOver
        title={isEditing ? "Edit Consultancy" : "Add New Consultancy"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contractBidNo" className="form-label">
              Contract/BID No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contractBidNo"
              name="contractBidNo"
              value={formData.contractBidNo}
              onChange={handleChange}
              className="form-input"
              required
              minLength={2}
              maxLength={50}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.contractBidNo.length}/50 characters
            </p>
          </div>

          <div>
            <label htmlFor="consultancyServices" className="form-label">
              Consultancy Services <span className="text-red-500">*</span>
            </label>
            <textarea
              id="consultancyServices"
              name="consultancyServices"
              value={formData.consultancyServices}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              required
              minLength={10}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.consultancyServices.length}/500 characters
            </p>
          </div>

          <div>
            <label htmlFor="contractSigned" className="form-label">
              Contract Signed Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="contractSigned"
              name="contractSigned"
              value={formData.contractSigned}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="contractor" className="form-label">
              Contractor <span className="text-red-500">*</span>
            </label>
            <select
              id="contractor"
              name="contractor"
              value={formData.contractor}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor._id} value={contractor._id}>
                  {contractor.name}
                </option>
              ))}
            </select>
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
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
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
