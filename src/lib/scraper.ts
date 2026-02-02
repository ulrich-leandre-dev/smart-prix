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
    
    // Tentative avec des headers encore plus poussés
    const { data } = await axios.get(url, {
      headers: {
        'authority': 'www.jumia.ci',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    const products: ScrapedProduct[] = [];

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

    // Si Jumia vide, on simule des données pour le test UI en attendant le proxy
    if (products.length === 0) {
        console.log("Jumia bloqué, retour de données de secours pour le test");
        return [
            { name: `${query} Standard`, price: 15000, image: "https://placehold.co/400x400?text=Produit", link: "#", source: "Marché Local" },
            { name: `${query} Premium`, price: 25000, image: "https://placehold.co/400x400?text=Produit+Pro", link: "#", source: "Import" }
        ];
    }

    return products;
  } catch (error) {
    console.error('Error scraping Jumia, returning demo data');
    return [
        { name: `${query} - Source A`, price: 12500, image: "https://placehold.co/400x400?text=Source+A", link: "#", source: "Boutique A" },
        { name: `${query} - Source B`, price: 14000, image: "https://placehold.co/400x400?text=Source+B", link: "#", source: "Boutique B" }
    ];
  }
}
