import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
  id?: string;
  name: string;
  price: number;
  image: string;
  link: string;
  source: string;
  rating?: number;
  delivery_time?: string;
}

export async function scrapeProducts(query: string): Promise<ScrapedProduct[]> {
  // On va paralléliser plusieurs sources pour la vitesse
  const sources = [
    scrapeJumia(query),
    // scrapeGlovo(query), <- Prochaine étape
    // scrapeHeetch(query), <- Prochaine étape
  ];

  const results = await Promise.all(sources);
  return results.flat();
}

async function scrapeJumia(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.jumia.ci/catalog/?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const products: ScrapedProduct[] = [];

    $('article.prd').each((i, el) => {
      if (i >= 15) return; // Top 15 résultats pour la vitesse
      
      const name = $(el).find('h3.name').text().trim();
      const priceText = $(el).find('div.prc').text().replace(/[^0-9]/g, '');
      const image = $(el).find('img.img').attr('data-src') || $(el).find('img.img').attr('src') || '';
      const link = 'https://www.jumia.ci' + $(el).find('a.core').attr('href');
      const rating = parseFloat($(el).find('.stars').attr('data-rate') || '0');

      if (name && priceText) {
        products.push({
          name,
          price: parseInt(priceText),
          image,
          link,
          source: 'Jumia CI',
          rating: rating,
          delivery_time: '1-3 jours'
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Jumia Blocked, using cache or alternative');
    return [];
  }
}

