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

interface CivilWorksProcurement {
  _id: string;
  lotNo: string;
  contractNo: string;
  workName: string;
  contractSignedDate: string;
  contractor: Contractor;
  createdAt: string;
}

export default function CivilWorksPage() {
  const [civilWorks, setCivilWorks] = useState<CivilWorksProcurement[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    lotNo: '',
    contractNo: '',
    workName: '',
    contractSignedDate: '',
    contractor: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    fetchCivilWorks();
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

  async function fetchCivilWorks() {
    try {
      setLoading(true);
      const response = await fetch('/api/procurement/civil-works');
      const data = await response.json();
      if (data.success) {
        setCivilWorks(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error fetching civil works:', error);
      setError('Failed to fetch civil works');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedContractor = contractors.find(c => c._id === formData.contractor);
      if (!selectedContractor) {
        setError('Please select a contractor');
        setLoading(false);
        return;
      }

      // Validate lotNo and contractNo
      if (!formData.lotNo.trim()) {
        setError('Lot Number is required');
        setLoading(false);
        return;
      }

      if (!formData.contractNo.trim()) {
        setError('Contract Number is required');
        setLoading(false);
        return;
      }

      const civilWorksData = {
        ...formData,
        contractor: selectedContractor._id,
      };

      const url = isEditing ? `/api/procurement/civil-works/${editingId}` : '/api/procurement/civil-works';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(civilWorksData),
      });

      const data = await response.json();
      
      if (data.success) {
        resetForm();
        fetchCivilWorks();
        setIsModalOpen(false);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to save civil works procurement');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this civil works procurement?')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/civil-works/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCivilWorks(civilWorks.filter(c => c._id !== id));
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete civil works procurement');
    }
  }

  const handleEdit = (item: CivilWorksProcurement) => {
    setFormData({
      lotNo: item.lotNo.toString(),
      contractNo: item.contractNo,
      workName: item.workName,
      contractSignedDate: new Date(item.contractSignedDate).toISOString().split('T')[0],
      contractor: item.contractor._id,
    });
    setIsEditing(true);
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      lotNo: '',
      contractNo: '',
      workName: '',
      contractSignedDate: '',
      contractor: '',
    });
    setIsEditing(false);
    setEditingId('');
    setError('');
  };

  // Filter civil works based on search term
  const filteredCivilWorks = civilWorks.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      (item.lotNo?.toLowerCase() || '').includes(searchString) ||
      (item.contractNo?.toLowerCase() || '').includes(searchString) ||
      (item.workName?.toLowerCase() || '').includes(searchString) ||
      (item.contractor?.name?.toLowerCase() || '').includes(searchString)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCivilWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCivilWorks = filteredCivilWorks.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading && civilWorks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Civil Works Procurement</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Add New Civil Works
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by lot no, contract no, work name, or contractor..."
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Work Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract Signed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Awarded To
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCivilWorks.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item.lotNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.contractNo}</td>
                <td className="px-6 py-4">{item.workName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.contractSignedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.contractor?.name}</td>
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

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <SlideOver
        title={isEditing ? "Edit Civil Works" : "Add New Civil Works"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lotNo" className="form-label">
              Lot No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lotNo"
              name="lotNo"
              value={formData.lotNo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contract Number
            </label>
            <input
              type="text"
              name="contractNo"
              value={formData.contractNo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="workName" className="form-label">
              Work Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="workName"
              name="workName"
              value={formData.workName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="contractSignedDate" className="form-label">
              Contract Signed Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="contractSignedDate"
              name="contractSignedDate"
              value={formData.contractSignedDate}
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
