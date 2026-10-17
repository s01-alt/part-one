export type Role = "shopper" | "brand" | "creator";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  likes: number;
  tags: string[];
  droppedAt: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  handle: string;
  location: string;
  tagline: string;
  followers: number;
  products: number;
  accent: string;
}

export interface FeedPost {
  id: string;
  productId: string;
  caption: string;
  brandHandle: string;
  likes: number;
  reposts: number;
  comments: number;
  postedAt: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  role: Role;
  city?: string;
  createdAt: string;
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  likes: number;
  tags: string[];
}
