import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCachedRootCategories, getSubCategories } from '@/services/categoryService';
import { CategoryResponse } from '@/types/responses/categoryResponse';

interface ProductCategoriesProps {
  handleClick: () => void;
  isOpen: boolean;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ handleClick, isOpen }) => {
  const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<number, CategoryResponse[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCategories = async () => {
    if (fetchedRef.current || isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      const rootCats = await getCachedRootCategories();
      setRootCategories(rootCats);

      const subCatsMap: Record<number, CategoryResponse[]> = {};
      const subCategoryPromises = rootCats.map(async (category) => {
        try {
          const subCats = await getSubCategories(category.id);
          subCatsMap[category.id] = subCats;
        } catch (error) {
          console.warn(`Failed to fetch subcategories for ${category.name}:`, error);
          subCatsMap[category.id] = [];
        }
      });

      await Promise.allSettled(subCategoryPromises);
      setSubCategoriesMap(subCatsMap);
      fetchedRef.current = true;
    } catch (err) {
      setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !fetchedRef.current) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
    handleClick();
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    navigate(`/category/${subCategoryId}`);
    handleClick();
  };

  const handleAllProductsClick = () => {
    navigate('/products');
    handleClick();
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      handleClick();
    }, 300);
  };

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative px-4">
      <h2 className="text-xl font-bold mb-4 text-white md:text-black flex cursor-pointer">
        <div className="flex items-center justify-center md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
            <rect className="fill-none" width="24" height="24" />
            <line className="stroke-white stroke-1.5 strokeLinecapRound strokeLinejoinRound" x1="16.5" y1="12" x2="3.75" y2="12" />
            <path className="stroke-white stroke-1.5 strokeLinecapRound strokeLinejoinRound" d="M46.75,56L40,62.75l6.75,6.75" transform="translate(-36.25 -50.75)" />
          </svg>
        </div>
        <span className="pl-4 md:pl-0">Danh mục sản phẩm</span>
      </h2>

      {isOpen && (
        <div ref={dropdownRef} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rootCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 p-3 rounded-lg">
                  <h3
                    className="font-semibold text-lg text-gray-800 mb-2 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    {category.name}
                  </h3>
                  <ul className="space-y-1">
                    {(subCategoriesMap[category.id] || []).map((subCategory) => (
                      <li
                        key={subCategory.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubCategoryClick(subCategory.id);
                        }}
                        className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
                      >
                        {subCategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="border border-dashed border-gray-300 p-3 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3
                  className="font-semibold text-lg text-red-600 text-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAllProductsClick();
                  }}
                >
                  Xem tất cả sản phẩm →
                </h3>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
