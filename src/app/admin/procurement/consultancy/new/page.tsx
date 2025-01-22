'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
}

export default function NewConsultancyPage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    contractBidNo: '',
    consultancyServices: '',
    contractSigned: '',
    contractor: '',
  });

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
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/procurement/consultancy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/procurement/consultancy');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create consultancy');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Add New Consultancy</h2>
        <Link
          href="/admin/procurement/consultancy"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Consultancies
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label htmlFor="contractBidNo" className="form-label">
              Contract/BID No
            </label>
            <input
              type="text"
              id="contractBidNo"
              name="contractBidNo"
              value={formData.contractBidNo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="consultancyServices" className="form-label">
              Consultancy Services
            </label>
            <textarea
              id="consultancyServices"
              name="consultancyServices"
              value={formData.consultancyServices}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              required
            />
          </div>

          <div>
            <label htmlFor="contractSigned" className="form-label">
              Contract Signed Date
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
              Contractor
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

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/procurement/consultancy"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Consultancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
