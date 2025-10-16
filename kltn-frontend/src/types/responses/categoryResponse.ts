// Category Response Types for API Integration

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  parentCategory?: CategoryResponse;
}

export interface CategoryApiResponse {
  code: number;
  message: string;
  result: CategoryResponse[];
}

export interface RootCategoriesResponse extends CategoryApiResponse {}

export interface SubCategoriesResponse extends CategoryApiResponse {}

// For UI display purposes
export interface CategoryGroup {
  title: string;
  subCategories: string[];
  categoryId?: number;
}

// API Error Response
export interface ApiErrorResponse {
  code: number;
  message: string;
  result?: null;
}