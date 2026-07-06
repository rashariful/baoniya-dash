// types/product.ts
export interface ProductImage {
  url: string;
}

export interface ProductVariant {
  sku: string;
  attributes: {
    size: string;
    color: string;
  };
  price: number;
  stock: number;
  image: {
    url: string;
    public_id?: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  reorderLevel: number;
  stockStatus: "in stock" | "out of stock";
  sold: number;
  category: {
    _id: string;
    name: string;
  } | null;
  supplier: {
    _id: string;
    name: string;
  } | null;
  brand: {
    _id: string;
    name: string;
  } | null;
  thumbnail: {
    url: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  marketingTags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  reorderLevel?: number;
  category?: string;
  supplier?: string;
  brand?: string;
  thumbnail: { url: string };
  images: { url: string }[];
  variants: ProductVariant[];
  marketingTags: string[];
}