'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
}

interface ConsultancyProcurement {
  _id: string;
  referenceNo: number;
  consultancyName: string;
  scope: string;
  contractor: Contractor;
  contractValue: number;
  contractSignedDate: string;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Terminated';
  createdAt: string;
}

export default function ConsultancyPage() {
  const [consultancies, setConsultancies] = useState<ConsultancyProcurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsultancies();
  }, []);

  async function fetchConsultancies() {
    try {
      const response = await fetch('/api/procurement/consultancy');
      const data = await response.json();
      if (data.success) {
        setConsultancies(data.data);
      }
    } catch (error) {
      setError('Failed to fetch consultancies');
      console.error('Error fetching consultancies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this consultancy?')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/consultancy/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchConsultancies();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete consultancy');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading consultancies...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Consultancy Procurement</h2>
        <Link
          href="/admin/procurement/consultancy/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Consultancy
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultancy Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contractor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultancies.map((consultancy) => (
              <tr key={consultancy._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {consultancy.referenceNo}
                </td>
                <td className="px-6 py-4">
                  {consultancy.consultancyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {consultancy.contractor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{consultancy.contractValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    {
                      'Not Started': 'bg-gray-100 text-gray-800',
                      'In Progress': 'bg-blue-100 text-blue-800',
                      'Completed': 'bg-green-100 text-green-800',
                      'Terminated': 'bg-red-100 text-red-800',
                    }[consultancy.status]
                  }`}>
                    {consultancy.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(consultancy.startDate).toLocaleDateString()} - {new Date(consultancy.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/procurement/consultancy/${consultancy._id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(consultancy._id)}
                    className="text-red-600 hover:text-red-900"
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
  );
}
