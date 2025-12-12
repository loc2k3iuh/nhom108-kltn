import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ProductDetailResponse, ProductVariant, Image as ProductImage } from '@/types/product';
import { getProductById, updateProduct } from '@/services/productService';
import { getProductVariantsByProductId, deleteProductVariant, updateProductVariant } from '@/services/productVariantService';
import { getProductDiscounts, applyDiscountToProducts, removeDiscountFromProducts } from '@/services/discountService';

import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';

const ProductListPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = Number(id);

    const [product, setProduct] = useState<ProductDetailResponse | null>(null);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({ name: '', description: '', basePrice: '', status: '' });

    const [currentDiscountPercent, setCurrentDiscountPercent] = useState(0);
    const [newDiscountPercent, setNewDiscountPercent] = useState('');

    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

    const fetchProductData = useCallback(async () => {
        if (!productId) return;
        setIsLoading(true);
        try {
            const [productData, variantsData, discountsData] = await Promise.all([
                getProductById(productId),
                getProductVariantsByProductId(productId),
                getProductDiscounts(productId)
            ]);

            setProduct(productData);
            setVariants(variantsData);
            setProductImages(productData.images || []);

            setFormData({
                name: productData.name,
                description: productData.description || '',
                basePrice: productData.basePrice.toString(),
                status: productData.status,
            });

            if (discountsData && discountsData.length > 0) {
                const discountValue = discountsData[0].discount.value;
                setCurrentDiscountPercent(discountValue);
                setNewDiscountPercent(String(discountValue));
            } else {
                setCurrentDiscountPercent(0);
                setNewDiscountPercent('0');
            }

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
        if (!product) return;
        navigate(`/tables/edit-variant/${productVariantId}`, {
            state: { productReference: product }
        });
    };

    const handleAddVariant = () => {
        navigate(`/forms/add-product-variant/${productId}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImageFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleDeleteNewImageFile = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteImage = (imageId: number) => {
        setImagesToDelete(prev => [...prev, imageId]);
        setProductImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSaveProduct = async () => {
        if (!product) return;

        const newBasePrice = parseFloat(formData.basePrice);
        const priceHasChanged = newBasePrice !== product.basePrice;

        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('basePrice', formData.basePrice);
        form.append('categoryId', String(product.category.id));
        form.append('brandId', String(product.brand.id));
        form.append('status', formData.status);
        newImageFiles.forEach(file => form.append('newImages', file));
        imagesToDelete.forEach(id => form.append('imagesToDelete', id.toString()));

        try {
            await updateProduct(product.id, form);
            toast.success('Product information updated successfully!');
        } catch (error: any) {
            toast.error(`Failed to update product info: ${error.message}`);
            return;
        }

        if (priceHasChanged) {
            toast.info('Base price changed. Synchronizing variant prices...');
            const updatePromises = variants.map(variant => {
                const variantFormData = new FormData();
                variantFormData.append('sku', variant.sku);
                variantFormData.append('price', formData.basePrice);
                variantFormData.append('stockQuantity', String(variant.stockQuantity));
                variantFormData.append('material', variant.material);
                variantFormData.append('sizeId', String(variant.size.id));
                variantFormData.append('colorId', String(variant.color.id));
                return updateProductVariant(variant.id, variantFormData);
            });

            try {
                await Promise.all(updatePromises);
                toast.success(`Successfully synchronized price for ${variants.length} variants.`);
            } catch (error: any) {
                toast.error(`Failed to synchronize variant prices: ${error.message}`);
            }
        }

        const newDiscountValue = newDiscountPercent === '' ? 0 : Number(newDiscountPercent);
        if (newDiscountValue !== currentDiscountPercent) {
            if (currentDiscountPercent > 0) {
                try {
                    await removeDiscountFromProducts(currentDiscountPercent, [productId]);
                    toast.success(`Successfully removed ${currentDiscountPercent}% discount.`);
                } catch (error: any) {
                    toast.error(`Failed to remove old discount: ${error.message}`);
                }
            }
            if (newDiscountValue > 0) {
                try {
                    await applyDiscountToProducts({ discountId: newDiscountValue, productIds: [productId] });
                    toast.success(`Successfully applied ${newDiscountValue}% discount.`);
                } catch (error: any) {
                    toast.error(`Failed to apply new discount: ${error.message}`);
                }
            }
        }
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
        return <div className="flex justify-center items-center h-screen"><p className="text-black dark:text-white">Loading Product...</p></div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen"><p className="text-black dark:text-white">Product not found.</p></div>;
    }

    return (
        <>
            <PageMeta title={`Edit Product | ${product.name}`} description={`Edit details for ${product.name}`} />
            <div className="flex justify-between items-center mb-4">
                <PageBreadcrumb pageTitle="Edit Product" />
                <Button variant="outline" onClick={() => navigate('/tables/category-product-list')}>
                    Back to Product List
                </Button>
            </div>

            <div className="space-y-6">
                <ComponentCard title="Product Information">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="basePrice">Base Price</Label>
                                <Input id="basePrice" name="basePrice" type="number" value={formData.basePrice} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <TextArea id="description" name="description" value={formData.description} onChange={(value) => setFormData(prev => ({ ...prev, description: value }))} rows={4} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Label>Category</Label>
                                <p className="w-full rounded border p-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white">{product.category.name}</p>
                            </div>
                            <div>
                                <Label>Brand</Label>
                                <p className="w-full rounded border p-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white">{product.brand.name}</p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select
                                    options={[{value: 'ACTIVE', label: 'ACTIVE'}, {value: 'INACTIVE', label: 'INACTIVE'}, {value: 'OUT_OF_STOCK', label: 'OUT_OF_STOCK'}]}
                                    value={formData.status}
                                    onChange={handleStatusChange}
                                />
                            </div>
                             <div>
                                <Label htmlFor="discount">Discount Percent (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={newDiscountPercent}
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                                            setNewDiscountPercent(value);
                                        }
                                    }}
                                    placeholder="0-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium text-black dark:text-white">Product Images</h4>
                            <ul className="flex flex-wrap gap-4 p-2 border rounded-md min-h-[120px] dark:border-strokedark">
                                {productImages.map(img => (
                                    <li key={img.id} className="relative group">
                                        <img src={img.imageUrl} alt={`Product image ${img.id}`} style={{ maxWidth: 200, borderRadius: 8 }} />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="absolute top-1 right-1 !p-1 !h-6 !w-6"
                                        >
                                            ×
                                        </Button>
                                    </li>
                                ))}
                                {newImageFiles.map((file, idx) => {
                                    const url = URL.createObjectURL(file);
                                    return (
                                        <li key={url} className="relative group">
                                            <img src={url} alt="New upload" style={{ maxWidth: 200, borderRadius: 8, opacity: 0.7 }} />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteNewImageFile(idx)}
                                                className="absolute top-1 right-1 !p-1 !h-6 !w-6"
                                            >
                                                ×
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="text-black dark:text-white"/>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleSaveProduct} variant="primary">
                                Save Product
                            </Button>
                        </div>
                    </div>
                </ComponentCard>

                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handleAddVariant} variant="primary">
                        Add Variant
                    </Button>
                </div>

                <ComponentCard title="Product Variants">

                    <div className="space-y-4">
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
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Price: {variant.price.toLocaleString()}đ - Stock: {variant.stockQuantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="sm" onClick={() => handleEditVariantProduct(variant.id)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteVariant(variant.id)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                        {variants.length === 0 && <p className="text-center py-4 text-black dark:text-white">No variants for this product.</p>}
                    </div>
                </ComponentCard>
            </div>
        </>
    );
};

export default ProductListPage;
