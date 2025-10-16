import React, { useState, useEffect } from 'react';
import { getRootCategories, getSubCategories } from '../services/categoryService';
import { CategoryResponse } from '../types/responses/categoryResponse';

const CategoryTest: React.FC = () => {
  const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRootCategories();
  }, []);

  const fetchRootCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await getRootCategories();
      setRootCategories(categories);
      console.log('Root categories:', categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching root categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(categoryId);
    try {
      const subcats = await getSubCategories(categoryId);
      setSubCategories(subcats);
      console.log(`Subcategories for category ${categoryId}:`, subcats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Category API Test</h1>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Root Categories */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Root Categories</h2>
          <div className="space-y-2">
            {rootCategories.map((category) => (
              <div
                key={category.id}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => fetchSubCategories(category.id)}
              >
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                <span className="text-xs text-blue-600">ID: {category.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Categories */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">
            Sub Categories 
            {selectedCategory && (
              <span className="text-sm font-normal text-gray-600">
                (for category {selectedCategory})
              </span>
            )}
          </h2>
          {subCategories.length > 0 ? (
            <div className="space-y-2">
              {subCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="p-3 rounded border bg-green-50 border-green-200"
                >
                  <h4 className="font-medium">{subCategory.name}</h4>
                  <p className="text-sm text-gray-600">{subCategory.description}</p>
                  <span className="text-xs text-green-600">ID: {subCategory.id}</span>
                  {subCategory.parentCategory && (
                    <p className="text-xs text-gray-500">
                      Parent: {subCategory.parentCategory.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedCategory 
                ? 'No subcategories found for selected category'
                : 'Select a root category to view subcategories'
              }
            </p>
          )}
        </div>
      </div>

      {/* API Info */}
      <div className="mt-8 bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">API Endpoints Being Used:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><code>GET /categories/root</code> - Get root categories</li>
          <li><code>GET /categories/{'{categoryId}'}/subcategories</code> - Get subcategories</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Make sure your backend server is running and VITE_API_BASE_URL is configured properly.
        </p>
      </div>
    </div>
  );
};

export default CategoryTest;