// Category Response Types for API Integration

export interface Category {
  id: number;
  name: string;
  description: string;
  parentCategory?: Category;
}

export interface CategoryApiResponse {
  code: number;
  message: string;
  result: Category[];
}

export type RootCategories = CategoryApiResponse

export type SubCategories = CategoryApiResponse

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