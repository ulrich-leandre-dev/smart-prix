import { supabase } from './supabase/client';
import { ScrapedProduct } from '../types';

export async function saveResultsToCache(query: string, products: ScrapedProduct[]) {
  try {
    const { error } = await supabase
      .from('search_cache')
      .upsert(
        products.map(p => ({
          query: query.toLowerCase(),
          product_name: p.name,
          price: p.price,
          image_url: p.image,
          source_link: p.link,
          source_name: p.source,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'product_name' }
      );

    if (error) console.error('Supabase Save Error:', error);
  } catch (e) {
    console.error('Cache system error:', e);
  }
}

export async function getCachedResults(query: string): Promise<ScrapedProduct[] | null> {
  try {
    const { data, error } = await supabase
      .from('search_cache')
      .select('*')
      .eq('query', query.toLowerCase())
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Cache de 24h

    if (error || !data || data.length === 0) return null;

    return data.map(item => ({
      name: item.product_name,
      price: item.price,
      image: item.image_url,
      link: item.source_link,
      source: item.source_name
    }));
  } catch (e) {
    return null;
  }
}
