
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { filterProducts } from "@/services/productService";
import { getSubCategories, getRootCategories } from "@/services/categoryService";
import { getBrands, getColors, getSizes } from "@/services/filterService";
import { mapProductToViewModel, ProductViewModel } from "@/mappers/productMapper";
import { PaginatedProductResponse } from "@/types/product";
import { CategoryResponse } from "@/types/responses/categoryResponse";
import { Brand } from "@/types/brand";
import { Color } from "@/types/color";
import { Size } from "@/types/size";
import FilterDropdown from "@/components/common/FilterDropdown";

const sortOptions = [
    { label: "Mới nhất", value: "createdAt,DESC" },
    { label: "Cũ nhất", value: "createdAt,ASC" },
    { label: "Bán chạy nhất", value: "orderCount,DESC" },
    { label: "Bán ít nhất", value: "orderCount,ASC" },
    { label: "Đánh giá cao nhất", value: "averageRating,DESC" },
    { label: "Đánh giá thấp nhất", value: "averageRating,ASC" },
    { label: "Giá: Thấp đến cao", value: "discountedPrice,ASC" },
    { label: "Giá: Cao đến thấp", value: "discountedPrice,DESC" },
    { label: "Lượt yêu thích", value: "favoriteCount,DESC" },
    { label: "Lượt yêu thích ít nhất", value: "favoriteCount,ASC" },
    { label: "Đánh giá nhiều nhất", value: "reviewCount,DESC" },
    { label: "Đánh giá ít nhất", value: "reviewCount,ASC" },
    { label: "Giảm giá nhiều nhất", value: "currentDiscountPercent,DESC" },
    { label: "Giảm giá ít nhất", value: "currentDiscountPercent,ASC" },
];

const ProductListPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const location = useLocation();
    const isAllProductsPage = location.pathname === '/products';

    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [rootCategory, setRootCategory] = useState<CategoryResponse | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [tempMinPrice, setTempMinPrice] = useState('');
    const [tempMaxPrice, setTempMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState<string>(sortOptions[0].value);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [brandsData, colorsData, sizesData] = await Promise.all([
                    getBrands(),
                    getColors(),
                    getSizes()
                ]);
                setBrands(brandsData);
                setColors(colorsData);
                setSizes(sizesData);
            } catch (error) {
                console.error("Failed to fetch filter data:", error);
                toast.error("Không thể tải dữ liệu bộ lọc.");
            }
        };
        fetchFilterData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const [sortBy, sortDirection] = sortOption.split(',');
                const payload: any = {
                    status:"ACTIVE",
                    page: page,
                    size: 12,
                    sortBy: sortBy,
                    sortDirection: sortDirection,
                };

                if (categoryId) {
                    const catId = parseInt(categoryId, 10);
                    const allRootCategories = await getRootCategories();
                    let targetCategory: CategoryResponse | undefined;
                    let parentCategory: CategoryResponse | undefined;
                    let subCategoryIds: number[] = [];

                    targetCategory = allRootCategories.find(c => c.id === catId);

                    if (targetCategory) {
                        setRootCategory(targetCategory);
                        setCategory(null);
                        const subCategories = await getSubCategories(catId);
                        subCategoryIds = subCategories.map(sc => sc.id);
                        if (subCategoryIds.length === 0) subCategoryIds.push(catId);
                    } else {
                        subCategoryIds = [catId];
                        for (const root of allRootCategories) {
                            const subCategories = await getSubCategories(root.id);
                            const foundSub = subCategories.find(sc => sc.id === catId);
                            if (foundSub) {
                                targetCategory = foundSub;
                                parentCategory = root;
                                break;
                            }
                        }
                        setCategory(targetCategory || null);
                        setRootCategory(parentCategory || null);
                    }
                    payload.categoryIds = subCategoryIds;
                } else {
                    setCategory(null);
                    setRootCategory(null);
                }

                if (selectedColorIds.length > 0) payload.colorIds = selectedColorIds;
                if (selectedSizeIds.length > 0) payload.sizeIds = selectedSizeIds;
                if (selectedBrandIds.length > 0) payload.brandIds = selectedBrandIds;
                if (minPrice !== undefined) payload.minPrice = minPrice;
                if (maxPrice !== undefined) payload.maxPrice = maxPrice;

                const response: PaginatedProductResponse = await filterProducts(payload);
                const mappedProducts: ProductViewModel[] = response.content.map((p) =>
                    mapProductToViewModel(p, { showZeroDiscountLabel: true })
                );

                setProducts(mappedProducts);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                toast.error("Không thể tải danh sách sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, page, selectedColorIds, selectedSizeIds, selectedBrandIds, minPrice, maxPrice, sortOption]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleColorChange = (colorId: number, isChecked: boolean) => {
        setSelectedColorIds(prev => 
            isChecked ? [...prev, colorId] : prev.filter(id => id !== colorId)
        );
        setPage(0);
    };

    const handleSizeChange = (sizeId: number, isChecked: boolean) => {
        setSelectedSizeIds(prev => 
            isChecked ? [...prev, sizeId] : prev.filter(id => id !== sizeId)
        );
        setPage(0);
    };

    const handleBrandChange = (brandId: number, isChecked: boolean) => {
        setSelectedBrandIds(prev => 
            isChecked ? [...prev, brandId] : prev.filter(id => id !== brandId)
        );
        setPage(0);
    };

    const handleApplyPriceFilter = () => {
        const min = tempMinPrice ? parseFloat(tempMinPrice) : undefined;
        const max = tempMaxPrice ? parseFloat(tempMaxPrice) : undefined;

        if (min !== undefined && max !== undefined && min > max) {
            toast.error("Giá tối thiểu không được lớn hơn giá tối đa.");
            return;
        }

        setMinPrice(min);
        setMaxPrice(max);
        setPage(0);
    };

    const pageTitle = isAllProductsPage ? "Tất cả sản phẩm" : (category?.name || rootCategory?.name || 'Danh mục sản phẩm');

    return (
        <div className="container mx-auto mt-8 mb-16">
            <nav className="text-sm mb-4 px-4">
                <Link to="/" className="hover:text-red-500">Trang chủ</Link>
                <span className="mx-2">/</span>
                {isAllProductsPage ? (
                    <span className="font-semibold">Tất cả sản phẩm</span>
                ) : (
                    <>
                        {rootCategory && <Link to={`/category/${rootCategory.id}`} className="hover:text-red-500">{rootCategory.name}</Link>}
                        {category && <span className="mx-2">/</span>}
                        {category && <span className="font-semibold">{category.name}</span>}
                    </>
                )}
            </nav>

            <div className="flex flex-col md:flex-row gap-8 px-4">
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>

                    <div className="space-y-1">
                        <div className="border-b py-3 px-1">
                            <h3 className="font-semibold mb-2">Khoảng giá</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <input 
                                    type="number"
                                    placeholder="Từ"
                                    value={tempMinPrice}
                                    onChange={(e) => setTempMinPrice(e.target.value)}
                                    className="w-full px-2 py-1 border rounded-md text-sm"
                                />
                                <span>-</span>
                                <input 
                                    type="number"
                                    placeholder="Đến"
                                    value={tempMaxPrice}
                                    onChange={(e) => setTempMaxPrice(e.target.value)}
                                    className="w-full px-2 py-1 border rounded-md text-sm"
                                />
                            </div>
                            <button 
                                onClick={handleApplyPriceFilter}
                                className="w-full bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                            >
                                Áp dụng
                            </button>
                        </div>
                        
                        <FilterDropdown 
                            title="Thương hiệu"
                            options={brands}
                            selectedIds={selectedBrandIds}
                            onSelectionChange={handleBrandChange}
                        />

                        <FilterDropdown 
                            title="Màu sắc"
                            options={colors}
                            selectedIds={selectedColorIds}
                            onSelectionChange={handleColorChange}
                        />

                        <FilterDropdown 
                            title="Kích thước"
                            options={sizes}
                            selectedIds={selectedSizeIds}
                            onSelectionChange={handleSizeChange}
                        />
                    </div>
                </aside>

                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">{pageTitle}</h1>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp theo:</label>
                            <select
                                id="sort-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg overflow-hidden shadow">
                                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                                    <div className="p-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                                        <Link to={product.link} className="block relative group">
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {product.discountPercent > 0 && (
                                                    <div className="absolute top-2 right-2 bg-[#C92127] text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                        {product.discountLabel}
                                                    </div>
                                                )}
                                                {product.isNew && (
                                                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                        Mới
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 h-10">
                                                    {product.title}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-[#C92127]">
                                                        {product.specialPrice}
                                                    </span>
                                                    <span className="text-xs text-gray-500 line-through">
                                                        {product.oldPrice}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <span className="text-yellow-500 mr-1">★</span>
                                                        <span>{(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0})</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {product.soldCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-8">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`mx-1 px-3 py-1 rounded ${page === i ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListPage;
