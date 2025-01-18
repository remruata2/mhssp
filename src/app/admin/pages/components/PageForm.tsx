'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface PageFormData {
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuOrder: number;
}

interface PageFormProps {
  onSubmit: (data: PageFormData) => void;
  loading?: boolean;
  initialData?: PageFormData & {
    id?: string;
  };
  error?: string;
}

export default function PageForm({
  onSubmit,
  loading = false,
  initialData,
  error,
}: PageFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  const [showInMenu, setShowInMenu] = useState(initialData?.showInMenu || false);
  const [menuOrder, setMenuOrder] = useState(initialData?.menuOrder || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      slug,
      isPublished,
      showInMenu,
      menuOrder,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500">{error}</div>}
        
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="form-label">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 form-label"
            >
              Published
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInMenu"
              checked={showInMenu}
              onChange={(e) => setShowInMenu(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="showInMenu"
              className="ml-2 form-label"
            >
              Show in Navigation
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="menuOrder"
              className="form-label"
            >
              Menu Order:
            </label>
            <input
              type="number"
              id="menuOrder"
              value={menuOrder}
              onChange={(e) => setMenuOrder(parseInt(e.target.value) || 0)}
              min="0"
              className="form-input w-20"
            />
            <span className="text-sm text-gray-500">
              (Lower numbers appear first)
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
