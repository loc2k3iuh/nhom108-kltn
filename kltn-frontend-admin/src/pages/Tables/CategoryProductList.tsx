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
import Button from "@/components/ui/button/Button";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";

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

    const handleRootCategoryChange = (value: string | number) => {
        setSelectedRootCatId(Number(value) || '');
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

    const handleAddProduct = () => {
        navigate('/forms/add-product');
    };

    return (
        <div>
            <PageMeta title="Product Management | Admin Dashboard" />
            <div className="flex justify-between items-center mb-4">
                <PageBreadcrumb pageTitle="Product Management" />
                <Button onClick={handleAddProduct} variant="primary">
                    Add Product
                </Button>
            </div>

            <div className="space-y-6">
                <ComponentCard title="Filter Products">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        <Select
                            options={[{ value: '', label: 'All Root Categories' }, ...rootCategories.map(cat => ({ value: cat.id, label: cat.name }))]}
                            value={selectedRootCatId}
                            onChange={handleRootCategoryChange}
                        />
                        <Select
                            options={[{ value: '', label: 'All Sub-Categories' }, ...subCategories.map(cat => ({ value: cat.id, label: cat.name }))]}
                            value={selectedSubCatId}
                            onChange={(value) => {setSelectedSubCatId(Number(value) || ''); resetPage();}}
                            disabled={!selectedRootCatId}
                        />
                        <Select
                            options={[{ value: '', label: 'All Statuses' }, ...mockStatus.map(s => ({ value: s.name, label: s.name }))]}
                            value={selectedStatus}
                            onChange={(value) => {setSelectedStatus(String(value)); resetPage();}}
                        />

                        <div className="flex items-center gap-2">
                            <Input type="number" placeholder="Min Price" value={tempMinPrice} onChange={e => setTempMinPrice(e.target.value)} />
                            <span className="text-black dark:text-white">-</span>
                            <Input type="number" placeholder="Max Price" value={tempMaxPrice} onChange={e => setTempMaxPrice(e.target.value)} />
                            <Button onClick={handleApplyPriceFilter} variant="primary" size="sm">Go</Button>
                        </div>

                        <Select
                            options={sortOptions}
                            value={sortOption}
                            onChange={(value) => {setSortOption(String(value)); resetPage();}}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <FilterDropdown title="Brands" options={brands} selectedIds={selectedBrandIds} onSelectionChange={handleBrandChange} />
                        <FilterDropdown title="Colors" options={colors} selectedIds={selectedColorIds} onSelectionChange={handleColorChange} />
                        <FilterDropdown title="Sizes" options={sizes} selectedIds={selectedSizeIds} onSelectionChange={handleSizeChange} />
                    </div>
                </ComponentCard>

                <ComponentCard title="Product List">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Product</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Brand</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Category</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Base Price</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Discounted Price</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Discount Percent</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={8} className="text-center py-10 text-black dark:text-white">Loading products...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-10 text-black dark:text-white">No products found.</td></tr>
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
                                            <p className="text-black dark:text-white">
                                                {product.discountedPrice != null
                                                    ? `${product.discountedPrice.toLocaleString()}đ`
                                                    : `${product.basePrice.toLocaleString()}đ`}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {product.currentDiscountPercent
                                                    ? `${product.currentDiscountPercent.toLocaleString()}%`
                                                    : '0%'}
                                            </p>
                                        </td>

                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${product.status === 'ACTIVE' ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                                                {product.status}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product.id)}>Edit</Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-8 mb-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                onClick={() => setPage(i)}
                                variant={page === i ? 'primary' : 'outline'}
                                size="sm"
                                className="mx-1"
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
};

export default CategoryProductList;
