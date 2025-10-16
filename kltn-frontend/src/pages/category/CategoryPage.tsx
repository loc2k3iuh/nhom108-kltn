import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { filterProducts } from '@/services/productService';
import { getCategoryById } from '@/services/categoryService';
import { Product, FilterPayload, FilteredProductPage, Category, SortBy } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';

const CategoryPage = () => {
  const { id } = useParams<{ id?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<FilteredProductPage | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterPayload>({
    page: 0,
    size: 12,
    sortDirection: 'DESC',
    sortBy: 'createdAt',
  });

  useEffect(() => {
    const categoryId = id ? parseInt(id, 10) : undefined;
    setFilters(prevFilters => ({
      ...prevFilters,
      categoryIds: categoryId ? [categoryId] : [],
      page: 0, 
    }));

    if (categoryId) {
      getCategoryById(categoryId)
        .then(setCategory)
        .catch(() => console.error('Failed to fetch category details'));
    } else {
      setCategory(null);
    }
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await filterProducts(filters);
        setProducts(result.content);
        setPageInfo(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortDirection] = e.target.value.split('_') as [SortBy, 'ASC' | 'DESC'];
    setFilters({ ...filters, sortBy, sortDirection, page: 0 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const renderPagination = () => {
    if (!pageInfo) return null;
    const { totalPages, number } = pageInfo;
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pages.map(p => (
          <button 
            key={p} 
            onClick={() => handlePageChange(p)}
            className={`px-4 py-2 border rounded-md ${number === p ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
            {p + 1}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{category ? category.name : 'Tất cả sản phẩm'}</h1>
      
      <div className="mb-8 p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
        <p className="text-gray-600">Hiển thị {pageInfo?.numberOfElements} trên tổng số {pageInfo?.totalElements} sản phẩm</p>
        <div>
          <label htmlFor="sort" className="mr-2">Sắp xếp theo:</label>
          <select id="sort" onChange={handleSortChange} className="border rounded-md p-2">
            <option value="createdAt_DESC">Mới nhất</option>
            <option value="orderCount_DESC">Bán chạy</option>
            <option value="basePrice_ASC">Giá: Thấp đến cao</option>
            <option value="basePrice_DESC">Giá: Cao đến thấp</option>
            <option value="favoriteCount_DESC">Yêu thích nhất</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center"><p>Đang tải sản phẩm...</p></div>}
      {error && <p className="text-red-500 text-center">Lỗi: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
