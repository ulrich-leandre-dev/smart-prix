import { NextResponse } from 'next/server';
import { scrapeJumia } from '@/lib/scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Recherche vide' }, { status: 400 });
  }

  const results = await scrapeJumia(query);
  return NextResponse.json({ results });
}
