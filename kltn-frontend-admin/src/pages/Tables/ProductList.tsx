import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ProductDetailResponse, ProductVariant, Image as ProductImage } from '@/types/product'; // Updated import

import { getProductById, updateProduct } from '@/services/productService';
import { getProductVariantsByProductId, deleteProductVariant } from '@/services/productVariantService';

import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';




const ProductListPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = Number(id);

    const [product, setProduct] = useState<ProductDetailResponse | null>(null); // Updated state type
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [formData, setFormData] = useState({ name: '', description: '', basePrice: '', status: '' });

    // Image state management
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    const fetchProductData = useCallback(async () => {
        if (!productId) return;
        setIsLoading(true);
        try {
            const productData = await getProductById(productId);
            const variantsData = await getProductVariantsByProductId(productId);

            setProduct(productData);
            setVariants(variantsData);

            console.log(variants)
            
            setProductImages(productData.images || []);

            setFormData({
                name: productData.name,
                description: productData.description || '',
                basePrice: productData.basePrice.toString(),
                status: productData.status,
            });
            
            setImagesToDelete([]);
            setNewImageFiles([]);

        } catch (error: any) {
            toast.error(`Failed to fetch product details: ${error.message}`);
            navigate('/tables/category-product-list');
        } finally {
            setIsLoading(false);
        }
    }, [productId, navigate]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleEditVariantProduct = (productVariantId: number) => {
        navigate(`/tables/edit-variant/${productVariantId}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleDeleteNewImageFile = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Xóa ảnh khỏi productImages và thêm id vào imagesToDelete
    const handleDeleteImage = (imageId: number) => {
        setImagesToDelete(prev => [...prev, imageId]);
        setProductImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSaveProduct = async () => {
        if (!product) return;
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('basePrice', formData.basePrice);
        form.append('categoryId', String(product.category.id));
        form.append('brandId', String(product.brand.id));
        form.append('status', formData.status);
        newImageFiles.forEach(file => {
            form.append('newImages', file);
        });
        imagesToDelete.forEach(id => {
            form.append('imagesToDelete', id.toString());
        });
        try {
            await updateProduct(product.id, form);
            toast.success('Product updated successfully!');
            fetchProductData();
        } catch (error: any) {
            toast.error(`Failed to update product: ${error.message}`);
        }
    };

    const handleOpenVariantModal = (variant: ProductVariant | null) => {
        setSelectedVariant(variant);
        setIsVariantModalOpen(true);
    };

    const handleCloseVariantModal = () => {
        setIsVariantModalOpen(false);
        setSelectedVariant(null);
        fetchProductData();
    };

    const handleDeleteVariant = async (variantId: number) => {
        if (window.confirm('Are you sure you want to delete this variant?')) {
            try {
                await deleteProductVariant(variantId);
                toast.success('Variant deleted.');
                setVariants(prev => prev.filter(v => v.id !== variantId));
            } catch (error: any) {
                toast.error(`Failed to delete variant: ${error.message}`);
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Product...</p></div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen"><p>Product not found.</p></div>;
    }

    return (
        <>
            <PageMeta title={`Edit Product | ${product.name}`} />
            <PageBreadcrumb pageTitle="Edit Product" />

            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Product Information</h3>
                    </div>
                    <div className="p-6.5">
                        {/* --- Form Fields --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className="block text-black dark:text-white mb-1">Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Base Price</label>
                                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-black dark:text-white mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full rounded border p-2 dark:bg-form-input"></textarea>
                            </div>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Category</label>
                                <p className="w-full rounded border p-2 bg-gray-100 dark:bg-gray-800">{product.category.name}</p>
                            </div>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Brand</label>
                                <p className="w-full rounded border p-2 bg-gray-100 dark:bg-gray-800">{product.brand.name}</p>
                            </div>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full rounded border p-2 dark:bg-form-input">
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                                </select>
                            </div>
                        </div>

                        {/* --- Unified Image Management --- */}
                        <div className="mt-6 space-y-4">
                            <h4 className="font-medium text-black dark:text-white">Product Images</h4>
                            <ul className="flex flex-wrap gap-4 p-2 border rounded-md min-h-[120px]">
                                {productImages.map(img => (
                                    <li key={img.id} className="relative group">
                                        <img src={img.imageUrl} alt={`Product image ${img.id}`} style={{ maxWidth: 200, borderRadius: 8 }} />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            title="Xóa ảnh"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                                {/* Hiển thị ảnh mới chưa có id */}
                                {newImageFiles.map((file, idx) => {
                                    const url = URL.createObjectURL(file);
                                    return (
                                        <li key={url} className="relative group">
                                            <img src={url} alt="New upload" style={{ maxWidth: 200, borderRadius: 8, opacity: 0.7 }} />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteNewImageFile(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                                title="Xóa ảnh mới"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} />
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={handleSaveProduct} className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* <!-- Variants List --> */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                        <h3 className="font-medium text-black dark:text-white">Product Variants</h3>
                        {/*<button onClick={() => handleOpenVariantModal(null)} className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90">Add Variant</button>*/}
                    </div>
                    <div className="p-6.5">
                        {variants.map(variant => (
                            <div key={variant.id} className="flex items-center justify-between p-2 border-b dark:border-strokedark last:border-b-0">
                                <div className="flex items-center gap-3">
                                    {variant.imageUrl ? (
                                        <img src={variant.imageUrl} alt={variant.sku} className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No Img</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-black dark:text-white">{variant.color.name} / {variant.size.name}</p>
                                        <p className="text-sm">Price: {variant.price.toLocaleString()}đ - Stock: {variant.stockQuantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleEditVariantProduct(variant.id)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button onClick={() => handleDeleteVariant(variant.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        ))}
                        {variants.length === 0 && <p className="text-center py-4">No variants for this product.</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductListPage;
