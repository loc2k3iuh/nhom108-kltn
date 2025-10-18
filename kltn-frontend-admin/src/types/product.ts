
// src/types/product.ts

// --- ORIGINAL TYPES (Restored) ---

export interface Category {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    parentName?: string;
    parentCategory?: Category; // For nested structures
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

export type ProductDetail = Product; // Keep original alias for backward compatibility

export interface PaginatedProductResponse {
    content: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// --- NEW TYPES FOR DETAIL PAGE ---

export interface Image {
    id: number;
    imageUrl: string;
    isMain: boolean;
    sortOrder: number;
}

// Reference to the parent product for SKU generation
export interface ProductReference {
    id: number;
    name: string;
    brand: Brand;
    category: Category;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stockQuantity: number;
    material: string;
    imageUrl: string;
    size: Size;
    color: Color;
    inStock?: boolean;
    images?: Image[];
    product?: ProductReference; // Add reference to parent product
}

export interface ProductDetailResponse {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    status: string;
    category: Category;
    brand: Brand;
    images: Image[];
    variants: ProductVariant[];
    averageRating: number;
    reviewCount: number; // Changed from totalReviews to match Product type
}
