
export async function getMenuPages() {
  try {
    const host = window.location.host; // Use window to get host in client-side

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const res = await fetch(`${protocol}://${host}/api/pages`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!data.success) {
      return [];
    }

    // Filter published pages and those marked for menu
    return data.data
      .filter((page: any) => page.isPublished && page.showInMenu)
      .sort((a: any, b: any) => a.menuOrder - b.menuOrder) // Sort by menuOrder
      .map((page: any) => ({
        name: page.title,
        href: `/pages/${page.slug}`,
      }));
  } catch (error) {
    console.error('Error fetching menu pages:', error);
    return [];
  }
}
