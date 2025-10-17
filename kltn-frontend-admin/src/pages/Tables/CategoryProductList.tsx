
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { getRootCategories, getSubCategories } from "@/services/categoryService";
import { filterProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { CategoryResponse } from "@/types/responses/categoryResponse";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import FilterDropdown from "@/components/common/FilterDropdown";

import { getBrands, getColors, getSizes } from "@/services/filterService";
import { Brand } from "@/types/brand";
import { Color } from "@/types/color";
import { Size } from "@/types/size";

const mockStatus = [
    { id: 1, name: 'ACTIVE' }, { id: 2, name: 'INACTIVE' }, { id: 3, name: 'OUT_OF_STOCK' }
];

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

const CategoryProductList: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    // Filter states
    const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
    const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
    const [selectedRootCatId, setSelectedRootCatId] = useState<number | ''>('');
    const [selectedSubCatId, setSelectedSubCatId] = useState<number | ''>('');
    const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
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

    const fetchFilteredProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [sortBy, sortDirection] = sortOption.split(',');
            const payload: any = { page, size: 10, sortBy, sortDirection };

            if (selectedSubCatId) {
                payload.categoryIds = [selectedSubCatId];
            } else if (selectedRootCatId) {
                const subs = await getSubCategories(selectedRootCatId);
                payload.categoryIds = subs.length > 0 ? subs.map(sc => sc.id) : [selectedRootCatId];
            }
            if (selectedBrandIds.length > 0) payload.brandIds = selectedBrandIds;
            if (selectedColorIds.length > 0) payload.colorIds = selectedColorIds;
            if (selectedSizeIds.length > 0) payload.sizeIds = selectedSizeIds;
            if (selectedStatus) payload.status = selectedStatus;
            if (minPrice !== undefined) payload.minPrice = minPrice;
            if (maxPrice !== undefined) payload.maxPrice = maxPrice;

            const response = await filterProducts(payload);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error("Failed to fetch products.");
        } finally {
            setIsLoading(false);
        }
    }, [page, sortOption, selectedSubCatId, selectedRootCatId, selectedBrandIds, selectedColorIds, selectedSizeIds, selectedStatus, minPrice, maxPrice]);

    useEffect(() => {
        getRootCategories().then(setRootCategories).catch(() => toast.error("Failed to fetch root categories."));
    }, []);

    useEffect(() => {
        if (selectedRootCatId) {
            getSubCategories(selectedRootCatId).then(setSubCategories).catch(() => toast.error("Failed to fetch sub-categories."));
        } else {
            setSubCategories([]);
        }
    }, [selectedRootCatId]);

    useEffect(() => {
        fetchFilteredProducts();
    }, [fetchFilteredProducts]);

    const resetPage = () => setPage(0);

    const handleRootCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRootCatId(Number(e.target.value) || '');
        setSelectedSubCatId('');
        resetPage();
    };

    const handleBrandChange = (id: number, checked: boolean) => { setSelectedBrandIds(p => checked ? [...p, id] : p.filter(i => i !== id)); resetPage(); };
    const handleColorChange = (id: number, checked: boolean) => { setSelectedColorIds(p => checked ? [...p, id] : p.filter(i => i !== id)); resetPage(); };
    const handleSizeChange = (id: number, checked: boolean) => { setSelectedSizeIds(p => checked ? [...p, id] : p.filter(i => i !== id)); resetPage(); };
    
    const handleApplyPriceFilter = () => {
        const min = tempMinPrice ? parseFloat(tempMinPrice) : undefined;
        const max = tempMaxPrice ? parseFloat(tempMaxPrice) : undefined;
        if (min !== undefined && max !== undefined && min > max) {
            toast.error("Min price cannot be greater than max price.");
            return;
        }
        setMinPrice(min);
        setMaxPrice(max);
        resetPage();
    };

    const handleEditProduct = (productId: number) => {
        navigate(`/tables/product-list/${productId}`);
    };

    return (
        <div>
            <PageMeta title="Product Management | Admin Dashboard" />
            <PageBreadcrumb pageTitle="Product Management" />

            {/* Filter Section */}
            <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <select value={selectedRootCatId} onChange={handleRootCategoryChange} className="w-full rounded border p-2 dark:bg-form-input">
                        <option value="">All Root Categories</option>
                        {rootCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <select value={selectedSubCatId} onChange={e => {setSelectedSubCatId(Number(e.target.value) || ''); resetPage();}} disabled={!selectedRootCatId} className="w-full rounded border p-2 disabled:bg-gray-200 dark:bg-form-input">
                        <option value="">All Sub-Categories</option>
                        {subCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>

                    <select value={selectedStatus} onChange={e => {setSelectedStatus(e.target.value); resetPage();}} className="w-full rounded border p-2 dark:bg-form-input">
                        <option value="">All Statuses</option>
                        {mockStatus.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min Price" value={tempMinPrice} onChange={e => setTempMinPrice(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                        <span>-</span>
                        <input type="number" placeholder="Max Price" value={tempMaxPrice} onChange={e => setTempMaxPrice(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                        <button onClick={handleApplyPriceFilter} className="rounded bg-primary px-4 py-2 text-white">Go</button>
                    </div>

                    <select value={sortOption} onChange={e => {setSortOption(e.target.value); resetPage();}} className="w-full rounded border p-2 dark:bg-form-input">
                        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FilterDropdown title="Brands" options={brands} selectedIds={selectedBrandIds} onSelectionChange={handleBrandChange} />
                    <FilterDropdown title="Colors" options={colors} selectedIds={selectedColorIds} onSelectionChange={handleColorChange} />
                    <FilterDropdown title="Sizes" options={sizes} selectedIds={selectedSizeIds} onSelectionChange={handleSizeChange} />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Product</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Brand</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Category</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Base Price</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-10">Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10">No products found.</td></tr>
                            ) : (products.map(product => (
                                <tr key={product.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white font-medium">{product.name}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{product.brand.name}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{product.category.name}</p>
                                    </td>
                                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{product.basePrice.toLocaleString()}đ</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${product.status === 'ACTIVE' ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                                            {product.status}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <button onClick={() => handleEditProduct(product.id)} className="hover:text-primary">Edit</button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-8 mb-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`mx-1 px-3 py-1 rounded ${page === i ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-meta-4'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;
