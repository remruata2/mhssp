'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageForm from '../components/PageForm';

export default function NewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: { title: string; content: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin/pages');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Page</h1>
      <PageForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
