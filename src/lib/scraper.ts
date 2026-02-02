import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
  name: string;
  price: number;
  image: string;
  link: string;
  source: string;
}

export async function scrapeJumia(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.jumia.ci/catalog/?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const products: ScrapedProduct[] = [];

    $('.prd').each((_, el) => {
      const name = $(el).find('.name').text();
      const priceText = $(el).find('.prc').text().replace(/[^0-9]/g, '');
      const image = $(el).find('.img').attr('data-src') || '';
      const link = 'https://www.jumia.ci' + $(el).find('a').attr('href');

      if (name && priceText) {
        products.push({
          name,
          price: parseInt(priceText),
          image,
          link,
          source: 'Jumia CI'
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping Jumia:', error);
    return [];
  }
}
