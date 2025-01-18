'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
      setError('Failed to fetch contractors');
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this contractor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/contractors/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchContractors();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete contractor');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading contractors...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Contractors</h2>
        <Link
          href="/admin/procurement/contractors/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register New Contractor
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contractors.map((contractor) => (
              <tr key={contractor._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contractor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contractor.registrationNumber}
                </td>
                <td className="px-6 py-4">
                  <div>{contractor.email}</div>
                  <div className="text-sm text-gray-500">{contractor.phone}</div>
                </td>
                <td className="px-6 py-4">{contractor.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(contractor.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/procurement/contractors/${contractor._id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(contractor._id)}
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
