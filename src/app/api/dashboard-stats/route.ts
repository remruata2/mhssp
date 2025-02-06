import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const endpoints = [
      '/api/procurement/contractors',
      '/api/procurement/civil-works',
      '/api/procurement/goods',
      '/api/procurement/consultancy',
      '/api/news',
      '/api/notices'
    ];

    const responses = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(`${origin}${endpoint}`, { headers: { 'Accept': 'application/json' } })
      )
    );

    const jsonData = await Promise.all(
      responses.map(async (res) => {
        if (!res.ok) {
          return { success: false, data: [] };
        }
        return res.json();
      })
    );

    const [contractors, civilWorks, goods, consultancy, news, notices] = jsonData;

    const stats = {
      contractors: contractors.data ? contractors.data.length : 0,
      civilWorks: civilWorks.data ? civilWorks.data.length : 0,
      goods: goods.data ? goods.data.length : 0,
      consultancies: consultancy.data ? consultancy.data.length : 0,
      news: news.data ? news.data.length : 0,
      notifications: notices.data ? notices.data.length : 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Error fetching dashboard stats' }, { status: 500 });
  }
}
