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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const products: ScrapedProduct[] = [];

    // Nouveau sélecteur Jumia plus précis
    $('article.prd').each((_, el) => {
      const name = $(el).find('.info .name').text().trim();
      const priceText = $(el).find('.info .prc').text().replace(/[^0-9]/g, '');
      const image = $(el).find('.img-c img.img').attr('data-src') || $(el).find('.img-c img.img').attr('src') || '';
      const link = 'https://www.jumia.ci' + $(el).find('a.core').attr('href');

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
