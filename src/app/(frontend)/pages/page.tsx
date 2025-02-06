import Link from 'next/link';
import { headers } from 'next/headers';

interface Page {
  _id: string;
  slug: string;
  title: string;
  isPublished: boolean;
}

async function getPages() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/pages`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });
  
  if (!res.ok) {
    return [];
  }
  
  const data = await res.json();
  return data.success ? data.data.filter((page: Page) => page.isPublished) : [];
}

export default async function PagesIndex() {
  const pages = await getPages();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pages</h1>
      <div className="grid gap-6">
        {pages.map((page: Page) => (
          <Link
            key={page._id}
            href={`/pages/${page.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
