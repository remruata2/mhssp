'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/ui/PageTitle';

interface CivilWork {
  _id: string;
  lotNo: number;
  contractNo: number;
  workName: string;
  contractSignedDate: string;
  contractor: {
    name: string;
  };
}

interface Goods {
  _id: string;
  referenceNo: number;
  goodsCategory: {
    _id: string;
    name: string;
  };
  itemName: string;
  quantity: number;
  contractSignedDate: string;
  contractor: {
    _id: string;
    name: string;
  };
}

interface Consultancy {
  _id: string;
  contractBidNo: string;
  consultancyServices: string;
  contractSigned: string;
  contractor: {
    _id: string;
    name: string;
  };
}

export default function ProcurementPage() {
  const [civilWorks, setCivilWorks] = useState<CivilWork[]>([]);
  const [goods, setGoods] = useState<Goods[]>([]);
  const [consultancy, setConsultancy] = useState<Consultancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'civil' | 'goods' | 'consultancy'>('civil');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [civilWorksRes, goodsRes, consultancyRes] = await Promise.all([
          fetch('/api/procurement/civil-works'),
          fetch('/api/procurement/goods'),
          fetch('/api/procurement/consultancy')
        ]);

        const [civilWorksData, goodsData, consultancyData] = await Promise.all([
          civilWorksRes.json(),
          goodsRes.json(),
          consultancyRes.json()
        ]);

        setCivilWorks(civilWorksData.data || []);
        setGoods(goodsData.data || []);
        setConsultancy(consultancyData.data || []);
      } catch (error) {
        console.error('Error fetching procurement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Procurement" 
        subtitle="View all procurement notices, tenders, and contracts"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Custom Tabs */}
        <div className="flex space-x-1 rounded-xl bg-blue-900 p-1 mb-6">
          <button
            onClick={() => setActiveTab('civil')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'civil'
                ? 'bg-white shadow text-blue-700'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`}
          >
            Civil Works
          </button>
          <button
            onClick={() => setActiveTab('goods')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'goods'
                ? 'bg-white shadow text-blue-700'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`}
          >
            Goods
          </button>
          <button
            onClick={() => setActiveTab('consultancy')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'consultancy'
                ? 'bg-white shadow text-blue-700'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`}
          >
            Consultancy
          </button>
        </div>

        {/* Civil Works Table */}
        {activeTab === 'civil' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lot Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract/BID No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name of Work
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract Signed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Awarded To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {civilWorks.map((work, index) => (
                    <tr key={work._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Lot {work.lotNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CW-{work.contractNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {work.workName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(work.contractSignedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {work.contractor.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Goods Table */}
        {activeTab === 'goods' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S. No.
                    </th>
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
                      Contract Signed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Awarded To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goods.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        GD-{item.referenceNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.goodsCategory.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.contractSignedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.contractor.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Consultancy Table */}
        {activeTab === 'consultancy' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract/BID No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultancy Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract Signed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Awarded To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultancy.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.contractBidNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.consultancyServices}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.contractSigned)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.contractor.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
