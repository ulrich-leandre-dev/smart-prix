import { NextResponse } from 'next/server';
import { scrapeProducts } from '@/lib/scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Recherche vide' }, { status: 400 });
  }

  try {
    const results = await scrapeProducts(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ results: [], error: "Erreur lors de la recherche" }, { status: 500 });
  }
}
