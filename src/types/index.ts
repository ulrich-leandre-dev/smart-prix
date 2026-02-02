export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  location: string;
  delivery_time_days: number;
}

export interface PriceRecord {
  id: string;
  product_id: string;
  seller_id: string;
  price: number;
  currency: string;
  is_available: boolean;
  updated_at: string;
}
