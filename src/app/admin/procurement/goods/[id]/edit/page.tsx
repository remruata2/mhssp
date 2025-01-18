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

interface GoodsProcurement {
  _id: string;
  referenceNo: number;
  goodsCategory: string;
  itemName: string;
  quantity: number;
  contractor: string;
  contractSignedDate: string;
}

export default function EditGoodsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [categories, setCategories] = useState<GoodsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<GoodsProcurement>({
    _id: '',
    referenceNo: 0,
    goodsCategory: '',
    itemName: '',
    quantity: 0,
    contractor: '',
    contractSignedDate: '',
  });

  useEffect(() => {
    Promise.all([
      fetchGoods(),
      fetchContractors(),
      fetchCategories()
    ]).finally(() => setLoading(false));
  }, []);

  async function fetchGoods() {
    try {
      const response = await fetch(`/api/procurement/goods/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        const goods = data.data;
        setFormData({
          ...goods,
          goodsCategory: goods.goodsCategory._id,
          contractor: goods.contractor._id,
          contractSignedDate: new Date(goods.contractSignedDate)
            .toISOString()
            .split('T')[0],
        });
      } else {
        setError('Failed to fetch goods details');
      }
    } catch (error) {
      setError('Failed to fetch goods details');
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
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/procurement/goods/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referenceNo: parseInt(formData.referenceNo.toString()),
          quantity: parseInt(formData.quantity.toString()),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/procurement/goods');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update goods');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading goods details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Edit Goods</h2>
        <Link
          href="/admin/procurement/goods"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Goods
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
                Category
              </label>
              <select
                value={formData.goodsCategory}
                onChange={(e) => setFormData({ ...formData, goodsCategory: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
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
