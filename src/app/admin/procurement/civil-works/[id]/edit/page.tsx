'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  contractor: string;
  contractSignedDate: string;
}

export default function EditCivilWorkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CivilWork>({
    _id: '',
    lotNo: 0,
    contractNo: 0,
    workName: '',
    contractor: '',
    contractSignedDate: '',
  });

  useEffect(() => {
    Promise.all([fetchCivilWork(), fetchContractors()]).finally(() => 
      setLoading(false)
    );
  }, []);

  async function fetchCivilWork() {
    try {
      const response = await fetch(`/api/procurement/civil-works/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        const work = data.data;
        setFormData({
          ...work,
          contractor: work.contractor._id,
          contractSignedDate: new Date(work.contractSignedDate)
            .toISOString()
            .split('T')[0],
        });
      } else {
        setError('Failed to fetch civil work details');
      }
    } catch (error) {
      setError('Failed to fetch civil work details');
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
      const response = await fetch(`/api/procurement/civil-works/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lotNo: parseInt(formData.lotNo.toString()),
          contractNo: parseInt(formData.contractNo.toString()),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/procurement/civil-works');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update civil work');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading civil work details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Edit Civil Work</h2>
        <Link
          href="/admin/procurement/civil-works"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Civil Works
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label htmlFor="lotNo" className="form-label">
              Lot No
            </label>
            <input
              type="number"
              id="lotNo"
              name="lotNo"
              value={formData.lotNo}
              onChange={(e) => setFormData({ ...formData, lotNo: parseInt(e.target.value) })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="contractNo" className="form-label">
              Contract No
            </label>
            <input
              type="number"
              id="contractNo"
              name="contractNo"
              value={formData.contractNo}
              onChange={(e) => setFormData({ ...formData, contractNo: parseInt(e.target.value) })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="workName" className="form-label">
              Work Name
            </label>
            <input
              type="text"
              id="workName"
              name="workName"
              value={formData.workName}
              onChange={(e) => setFormData({ ...formData, workName: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
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

          <div>
            <label htmlFor="contractSignedDate" className="form-label">
              Contract Signed Date
            </label>
            <input
              type="date"
              id="contractSignedDate"
              name="contractSignedDate"
              value={formData.contractSignedDate}
              onChange={(e) => setFormData({ ...formData, contractSignedDate: e.target.value })}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
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
