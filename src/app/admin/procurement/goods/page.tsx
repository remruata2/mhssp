'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GoodsCategory {
  _id: string;
  name: string;
}

interface Contractor {
  _id: string;
  name: string;
}

interface GoodsProcurement {
  _id: string;
  referenceNo: number;
  goodsCategory: GoodsCategory;
  itemName: string;
  quantity: number;
  contractor: Contractor;
  contractSignedDate: string;
  createdAt: string;
}

export default function GoodsPage() {
  const [goods, setGoods] = useState<GoodsProcurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoods();
  }, []);

  async function fetchGoods() {
    try {
      const response = await fetch('/api/procurement/goods');
      const data = await response.json();
      if (data.success) {
        setGoods(data.data);
      }
    } catch (error) {
      setError('Failed to fetch goods');
      console.error('Error fetching goods:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this goods procurement?')) {
      return;
    }

    try {
      const response = await fetch(`/api/procurement/goods/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchGoods();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete goods procurement');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading goods procurement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Goods Procurement</h2>
        <div className="space-x-4">
          <Link
            href="/admin/procurement/goods/categories"
            className="text-blue-600 hover:text-blue-800"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/procurement/goods/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Goods
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
                Reference No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
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
            {goods.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.referenceNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.goodsCategory.name}
                </td>
                <td className="px-6 py-4">
                  {item.itemName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.contractor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.contractSignedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/procurement/goods/${item._id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
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
