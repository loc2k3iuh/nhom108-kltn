
// src/types/product.ts

export interface Category {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    parentName?: string;
}

export interface Brand {
    id: number;
    name: string;
    description?: string;
    logoUrl?: string;
}

export interface Size {
    id: number;
    name: string;
    description?: string;
}

export interface Color {
    id: number;
    name: string;
    hexCode?: string;
    description?: string;
}

export interface Variant {
    id: number;
    sku: string;
    price: number;
    stockQuantity: number;
    material: string;
    imageUrl: string;
    size: Size;
    color: Color;
    inStock: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    status: string;
    category: Category;
    rootCategory: Category;
    categoryPath: Category[];
    brand: Brand;
    variants: Variant[];
    availableSizes: Size[];
    availableColors: Color[];
    availableMaterials: string[];
    minPrice: number;
    maxPrice: number;
    currentDiscountPercent: number | null;
    discountedPrice: number | null;
    totalStock: number;
    inStock: boolean;
    imageUrls: string[];
    primaryImageUrl: string;
    createdAt: number[];
    updatedAt: number[];
    isNew: boolean;
    favoriteCount: number;
    orderCount: number;
    reviewCount: number;
    averageRating: number;
    slug: string;
}

export type ProductDetail = Product;

export interface PaginatedProductResponse {
    content: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}