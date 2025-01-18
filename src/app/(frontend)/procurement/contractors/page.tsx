'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
  createdAt: string;
}

interface FormData {
  name: string;
  registrationNo: string;
  address: string;
  phone: string;
  email: string;
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    registrationNo: '',
    address: '',
    phone: '',
    email: '',
  });
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
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/procurement/contractors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData({
          name: '',
          registrationNo: '',
          address: '',
          phone: '',
          email: '',
        });
        fetchContractors();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create contractor');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Contractors</h1>
          <Link
            href="/procurement"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Add New Contractor Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label htmlFor="name" className="form-label">
              Contractor Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="registrationNo" className="form-label">
              Registration No
            </label>
            <input
              type="text"
              id="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              name="registrationNo"
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              name="address"
              rows={3}
              className="form-textarea"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              name="phone"
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Contractor
          </button>
        </form>

        {/* Contractors List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
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
                    {new Date(contractor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(contractor._id)}
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
