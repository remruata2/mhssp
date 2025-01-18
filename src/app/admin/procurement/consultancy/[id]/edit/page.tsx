'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  contractor: string;
  contractValue: number;
  contractSignedDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function EditConsultancyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ConsultancyProcurement>({
    _id: '',
    referenceNo: 0,
    consultancyName: '',
    scope: '',
    contractor: '',
    contractValue: 0,
    contractSignedDate: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    Promise.all([
      fetchConsultancy(),
      fetchContractors()
    ]).finally(() => setLoading(false));
  }, []);

  async function fetchConsultancy() {
    try {
      const response = await fetch(`/api/procurement/consultancy/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        const consultancy = data.data;
        setFormData({
          ...consultancy,
          contractor: consultancy.contractor._id,
          contractSignedDate: new Date(consultancy.contractSignedDate)
            .toISOString()
            .split('T')[0],
          startDate: new Date(consultancy.startDate)
            .toISOString()
            .split('T')[0],
          endDate: new Date(consultancy.endDate)
            .toISOString()
            .split('T')[0],
        });
      } else {
        setError('Failed to fetch consultancy details');
      }
    } catch (error) {
      setError('Failed to fetch consultancy details');
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
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/procurement/consultancy/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referenceNo: parseInt(formData.referenceNo.toString()),
          contractValue: parseFloat(formData.contractValue.toString()),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/procurement/consultancy');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update consultancy');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading consultancy details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Edit Consultancy</h2>
        <Link
          href="/admin/procurement/consultancy"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Consultancies
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference No
              </label>
              <input
                type="number"
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: parseInt(e.target.value) })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contractor
              </label>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Consultancy Name
              </label>
              <input
                type="text"
                value={formData.consultancyName}
                onChange={(e) => setFormData({ ...formData, consultancyName: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Scope of Work
              </label>
              <textarea
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                rows={4}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contract Value (₹)
              </label>
              <input
                type="number"
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contract Signed Date
              </label>
              <input
                type="date"
                value={formData.contractSignedDate}
                onChange={(e) => setFormData({ ...formData, contractSignedDate: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-500">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
