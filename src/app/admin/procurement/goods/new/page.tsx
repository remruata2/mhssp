'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contractor {
  _id: string;
  name: string;
}

interface GoodsCategory {
  _id: string;
  name: string;
}

export default function NewGoodsPage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [categories, setCategories] = useState<GoodsCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    referenceNo: '',
    goodsCategory: '',
    itemName: '',
    quantity: '',
    contractor: '',
    contractSignedDate: '',
  });

  useEffect(() => {
    Promise.all([fetchContractors(), fetchCategories()]);
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

  async function fetchCategories() {
    try {
      const response = await fetch('/api/procurement/goods/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/procurement/goods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referenceNo: parseInt(formData.referenceNo),
          quantity: parseInt(formData.quantity),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/procurement/goods');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create goods procurement');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Add New Goods</h2>
        <Link
          href="/admin/procurement/goods"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Goods
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label htmlFor="referenceNo" className="form-label">
              Reference No
            </label>
            <input
              type="number"
              id="referenceNo"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="goodsCategory" className="form-label">
              Category
            </label>
            <select
              id="goodsCategory"
              name="goodsCategory"
              value={formData.goodsCategory}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="itemName" className="form-label">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
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

          <div>
            <label htmlFor="contractSignedDate" className="form-label">
              Contract Signed Date
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

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goods Procurement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
