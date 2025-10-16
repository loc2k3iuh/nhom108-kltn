import axiosInstance from "../lib/axios";
import { 
  CategoryResponse, 
  RootCategoriesResponse, 
  SubCategoriesResponse,
  ApiErrorResponse
} from "@/types/responses/categoryResponse";

/**
 * Get all root categories (parent categories without parent)
 * @returns Promise<CategoryResponse[]>
 */
export const getRootCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await axiosInstance.get<RootCategoriesResponse>("/categories/root");
    
    if (response.data.code === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to fetch root categories");
    }
  } catch (error: any) {
    console.error("Error fetching root categories:", error);
    
    // Handle different types of errors
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse;
      throw new Error(errorData.message || "Failed to fetch root categories");
    }
    
    throw new Error("Network error: Unable to fetch categories");
  }
};

/**
 * Get subcategories for a specific parent category
 * @param categoryId - ID of the parent category
 * @returns Promise<CategoryResponse[]>
 */
export const getSubCategories = async (categoryId: number): Promise<CategoryResponse[]> => {
  try {
    const response = await axiosInstance.get<SubCategoriesResponse>(`/categories/${categoryId}/subcategories`);
    
    if (response.data.code === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to fetch subcategories");
    }
  } catch (error: any) {
    console.error(`Error fetching subcategories for category ${categoryId}:`, error);
    
    // Handle different types of errors
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse;
      throw new Error(errorData.message || "Failed to fetch subcategories");
    }
    
    throw new Error("Network error: Unable to fetch subcategories");
  }
};

/**
 * Get all categories with their subcategories in one call
 * This function fetches root categories and then their subcategories
 * @returns Promise with structured category data
 */
export const getAllCategoriesWithSub = async (): Promise<{
  [key: string]: {
    category: CategoryResponse;
    subCategories: CategoryResponse[];
  }
}> => {
  try {
    const rootCategories = await getRootCategories();
    const categoriesWithSub: { [key: string]: { category: CategoryResponse; subCategories: CategoryResponse[] } } = {};
    
    // Fetch subcategories for each root category
    const subCategoryPromises = rootCategories.map(async (category) => {
      try {
        const subCategories = await getSubCategories(category.id);
        return { category, subCategories };
      } catch (error) {
        console.warn(`Failed to fetch subcategories for ${category.name}:`, error);
        // Return category with empty subcategories if fetch fails
        return { category, subCategories: [] };
      }
    });
    
    const results = await Promise.allSettled(subCategoryPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { category, subCategories } = result.value;
        categoriesWithSub[category.name] = { category, subCategories };
      }
    });
    
    return categoriesWithSub;
  } catch (error) {
    console.error("Error fetching all categories with subcategories:", error);
    throw error;
  }
};

/**
 * Cache key for localStorage
 */
const CATEGORIES_CACHE_KEY = "vuvisa_product_categories";
const CACHE_EXPIRY_KEY = "vuvisa_categories_cache_expiry";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getCachedRootCategories = async (): Promise<CategoryResponse[]> => {
  try {
    // Check cache first
    const cachedData = localStorage.getItem(CATEGORIES_CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (cachedData && cacheExpiry) {
      const expiryTime = parseInt(cacheExpiry, 10);
      const currentTime = Date.now();
      
      if (currentTime < expiryTime) {
        return JSON.parse(cachedData);
      }
    }
    
    // Fetch fresh data if cache is expired or doesn't exist
    const categories = await getRootCategories();
    
    // Cache the data
    try {
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(categories));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } catch (storageError) {
      console.warn("Failed to cache categories:", storageError);
    }
    
    return categories;
  } catch (error) {
    // If API fails, try to return cached data even if expired
    const cachedData = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cachedData) {
      console.warn("Using expired cache due to API failure");
      return JSON.parse(cachedData);
    }
    
    throw error;
  }
};

/**
 * Clear categories cache
 */
export const clearCategoriesCache = (): void => {
  localStorage.removeItem(CATEGORIES_CACHE_KEY);
  localStorage.removeItem(CACHE_EXPIRY_KEY);
};