// src/features/product/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in IDR
  stock: number;
  imageUrl: string;
  storeId: string;
  storeName: string;
  rating: number; // 0–5
  reviewCount: number;
  category: string;
}
