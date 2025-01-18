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
  contractor: Contractor;
  contractSignedDate: string;
  createdAt: string;
}

export default function CivilWorksPage() {
  const [works, setWorks] = useState<CivilWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorks();
  }, []);

  async function fetchWorks() {
    try {
      const response = await fetch('/api/procurement/civil-works');
      const data = await response.json();
      if (data.success) {
        setWorks(data.data);
      }
    } catch (error) {
      setError('Failed to fetch civil works');
      console.error('Error fetching civil works:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this civil work?')) {
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
      setError('Failed to delete civil work');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading civil works...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Civil Works</h2>
        <div className="space-x-4">
          <Link
            href="/admin/procurement"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Procurement
          </Link>
          <Link
            href="/admin/procurement/civil-works/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Civil Work
          </Link>
        </div>
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
                Contract Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {works.map((work) => (
              <tr key={work._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {work.lotNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {work.contractNo}
                </td>
                <td className="px-6 py-4">
                  {work.workName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {work.contractor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(work.contractSignedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/procurement/civil-works/${work._id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(work._id)}
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
