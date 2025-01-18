'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import PageForm from '../../components/PageForm';
import Link from 'next/link';

interface PageData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuOrder: number;
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${id}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Page not found');
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch page: ${errorText}`);
        }

        const data = await response.json();
        if (data.success) {
          setPage(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch page');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch page data');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  const handleSubmit = async (formData: Omit<PageData, '_id'>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update page: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        router.push('/admin/pages');
      } else {
        throw new Error(data.error || 'Failed to update page');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      setError(error instanceof Error ? error.message : 'Failed to update page');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !page) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Edit Page</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {page && (
        <PageForm
          initialData={{
            title: page.title,
            content: page.content,
            slug: page.slug,
            isPublished: page.isPublished,
            showInMenu: page.showInMenu,
            menuOrder: page.menuOrder,
            id: page._id,
          }}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
      <div className="mt-4">
        <Link
          href="/admin/pages"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Pages
        </Link>
      </div>
    </div>
  );
}
