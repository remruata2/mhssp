'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
}

interface CivilWork {
  _id: string;
  lotNo: number;
  contractNo: number;
  workName: string;
  contractSignedDate: string;
  contractor: Contractor;
}

export default function CivilWorksPage() {
  const [works, setWorks] = useState<CivilWork[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    lotNo: '',
    contractNo: '',
    workName: '',
    contractSignedDate: '',
    contractor: ''
  });

  useEffect(() => {
    fetchWorks();
    fetchContractors();
  }, []);

  async function fetchWorks() {
    try {
      const response = await fetch('/api/procurement/civil-works');
      const data = await response.json();
      if (data.success) {
        setWorks(data.data);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/procurement/civil-works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lotNo: parseInt(formData.lotNo),
          contractNo: parseInt(formData.contractNo)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData({
          lotNo: '',
          contractNo: '',
          workName: '',
          contractSignedDate: '',
          contractor: ''
        });
        fetchWorks();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create civil work');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this work?')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/civil-works/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchWorks();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete work');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading civil works...</div>;
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Civil Works Procurement</h1>
          <Link
            href="/procurement"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Add New Civil Work Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Civil Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lot No</label>
              <input
                type="number"
                value={formData.lotNo}
                onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract No</label>
              <input
                type="number"
                value={formData.contractNo}
                onChange={(e) => setFormData({ ...formData, contractNo: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Work Name</label>
              <input
                type="text"
                value={formData.workName}
                onChange={(e) => setFormData({ ...formData, workName: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract Signed Date</label>
              <input
                type="date"
                value={formData.contractSignedDate}
                onChange={(e) => setFormData({ ...formData, contractSignedDate: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contractor</label>
              <select
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
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
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Civil Work
          </button>
        </form>

        {/* Civil Works List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signed Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {works.map((work) => (
                <tr key={work._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{work.lotNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{work.contractNo}</td>
                  <td className="px-6 py-4">{work.workName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{work.contractor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(work.contractSignedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(work._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
