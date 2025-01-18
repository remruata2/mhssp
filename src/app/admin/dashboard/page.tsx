'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  contractors: number;
  civilWorks: number;
  goods: number;
  consultancies: number;
  news: number;
  notifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    contractors: 0,
    civilWorks: 0,
    goods: 0,
    consultancies: 0,
    news: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithErrorHandling = async (url: string, name: string) => {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`${name}: ${errorText}`);
    }
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(`${name}: ${data.error || 'Failed to fetch data'}`);
    }
    
    return data;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [contractors, civilWorks, goods, consultancies, news, notifications] = await Promise.all([
          fetchWithErrorHandling('/api/procurement/contractors', 'Contractors'),
          fetchWithErrorHandling('/api/procurement/civil-works', 'Civil Works'),
          fetchWithErrorHandling('/api/procurement/goods', 'Goods'),
          fetchWithErrorHandling('/api/procurement/consultancy', 'Consultancies'),
          fetchWithErrorHandling('/api/news', 'News'),
          fetchWithErrorHandling('/api/notices', 'Notices'),
        ]);

        setStats({
          contractors: contractors.data?.length || 0,
          civilWorks: civilWorks.data?.length || 0,
          goods: goods.data?.length || 0,
          consultancies: consultancies.data?.length || 0,
          news: news.data?.length || 0,
          notifications: notifications.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Procurement Stats */}
        <Link href="/admin/procurement">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out h-full relative min-h-[320px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Procurement</h3>
              <span className="bg-blue-500/30 rounded-full p-2">
                <svg className="w-6 h-6 transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold mb-2">{stats.civilWorks + stats.goods + stats.consultancies}</div>
              <div className="text-blue-100">Total Procurements</div>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Civil Works</span>
                <span className="text-xl font-bold">{stats.civilWorks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Goods</span>
                <span className="text-xl font-bold">{stats.goods}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Consultancies</span>
                <span className="text-xl font-bold">{stats.consultancies}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* News Stats */}
        <Link href="/admin/news">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out h-full relative min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">News</h3>
              <span className="bg-emerald-500/30 rounded-full p-2">
                <svg className="w-6 h-6 transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold mb-2">{stats.news}</div>
              <div className="text-emerald-100">Total News Items</div>
            </div>
          </div>
        </Link>

        {/* Notifications Stats */}
        <Link href="/admin/notifications">
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out h-full relative min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <span className="bg-amber-500/30 rounded-full p-2">
                <svg className="w-6 h-6 transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold mb-2">{stats.notifications}</div>
              <div className="text-amber-100">Active Notifications</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/procurement/contractors/new"
            className="group flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 transform transition-all duration-300"
          >
            <span className="text-blue-600 group-hover:scale-105 transition-transform duration-300">Add New Contractor</span>
          </Link>
          <Link
            href="/admin/procurement/civil-works/new"
            className="group flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 transform transition-all duration-300"
          >
            <span className="text-blue-600 group-hover:scale-105 transition-transform duration-300">Add Civil Work</span>
          </Link>
          <Link
            href="/admin/procurement/goods/new"
            className="group flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 transform transition-all duration-300"
          >
            <span className="text-blue-600 group-hover:scale-105 transition-transform duration-300">Add Goods</span>
          </Link>
          <Link
            href="/admin/procurement/consultancy/new"
            className="group flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 transform transition-all duration-300"
          >
            <span className="text-blue-600 group-hover:scale-105 transition-transform duration-300">Add Consultancy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
