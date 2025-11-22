import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { getProductVariantById, updateProductVariant } from "@/services/productVariantService.ts";
import { getColors, getSizes } from "@/services/filterService";
import { ProductVariant, ProductReference } from '@/types/product';
import { Color } from '@/types/color';
import { Size } from '@/types/size';

const toSkuString = (str: string | undefined): string => {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '');
    return str.toUpperCase();
};

export default function EditVariant() {

    const { variantId } = useParams<{ variantId: string }>();
    const id = Number(variantId);
    const location = useLocation();
    
    const [productReference, setProductReference] = useState<ProductReference | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [variant, setVariant] = useState<ProductVariant | null>(null);

    // Form state
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [material, setMaterial] = useState('');
    const [sizeId, setSizeId] = useState<number | ''>('');
    const [colorId, setColorId] = useState<number | ''>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Select options
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    useEffect(() => {
        const productRefFromState = location.state?.productReference as ProductReference | undefined;
        if (!productRefFromState) {
            toast.error("Product information is missing. Cannot edit variant.");
            navigate(-1);
            return;
        }
        setProductReference(productRefFromState);

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [variantData, colorsData, sizesData] = await Promise.all([
                    getProductVariantById(id),
                    getColors(),
                    getSizes(),
                ]);

                setVariant(variantData);
                setPrice(variantData.price ? String(variantData.price) : '');
                setStockQuantity(variantData.stockQuantity ? String(variantData.stockQuantity) : '');
                setMaterial(variantData.material || '');
                setSizeId(variantData.size?.id || '');
                setColorId(variantData.color?.id || '');
                setImageUrl(variantData.imageUrl || null);

                setColors(colorsData);
                setSizes(sizesData);

            } catch (err: any) {
                setError('Không thể tải dữ liệu variant.');
                toast.error('Không thể tải dữ liệu variant.');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchInitialData();
        }
    }, [id, location.state, navigate]);

    useEffect(() => {
        if (productReference && colorId && sizeId && colors.length > 0 && sizes.length > 0) {
            const color = colors.find(c => c.id === colorId);
            const size = sizes.find(s => s.id === sizeId);

            if (color && size) {
                const subCatName = toSkuString(productReference.category.name);
                const brandName = toSkuString(productReference.brand.name);
                const colorName = toSkuString(color.name);
                const sizeName = toSkuString(size.name);

                const skuParts = [subCatName, brandName, colorName, sizeName];
                const generatedSku = skuParts.filter(Boolean).join('-');
                setSku(generatedSku);
            }
        }
    }, [colorId, sizeId, productReference, colors, sizes]);

    const handleDeleteImageFile = () => {
        setImageFile(null);
        setImageUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!sku || !price || !stockQuantity || !sizeId || !colorId) {
            setError('Vui lòng nhập đủ thông tin bắt buộc.');
            return;
        }
        const formData = new FormData();
        formData.append('sku', sku);
        formData.append('price', price);
        formData.append('stockQuantity', stockQuantity);
        formData.append('material', material);
        formData.append('sizeId', String(sizeId));
        formData.append('colorId', String(colorId));
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        try {
            await updateProductVariant(id, formData);
            setSuccess('Cập nhật variant thành công!');
            toast.success('Cập nhật variant thành công!');
            setTimeout(() => navigate(-1), 1200);
        } catch (err: any) {
            setError(err.message || 'Cập nhật thất bại.');
            toast.error(err.message || 'Cập nhật thất bại.');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!variant) return <div>Không tìm thấy variant.</div>;

    return (
        <div>
            <PageMeta title="Edit Variant" />
            <PageBreadcrumb pageTitle="Edit Variant" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-xl mx-auto mt-8">
                <form onSubmit={handleSubmit} className="p-6.5">
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-500">{success}</div>}
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">SKU</label>
                        <input type="text" value={sku} className="w-full rounded border p-2 bg-gray-200 dark:bg-form-input" readOnly />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Giá</label>
                        <input type="number" value={price} className="w-full rounded border p-2 bg-gray-200 dark:bg-form-input" readOnly />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Số lượng tồn kho</label>
                        <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} min={0} className="w-full rounded border p-2" required />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Chất liệu</label>
                        <input type="text" value={material} onChange={e => setMaterial(e.target.value)} maxLength={255} className="w-full rounded border p-2" />
                    </div>
                    {/*<div className="mb-4.5 flex gap-4">*/}
                    {/*    <div className="w-1/2">*/}
                    {/*        <label className="mb-2.5 block text-black dark:text-white">Màu sắc</label>*/}
                    {/*        <select disabled value={colorId} onChange={e => setColorId(Number(e.target.value))} className="w-full rounded border p-2" required>*/}
                    {/*            <option value="">Chọn màu</option>*/}
                    {/*            {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*    <div className="w-1/2">*/}
                    {/*        <label className="mb-2.5 block text-black dark:text-white">Kích cỡ</label>*/}
                    {/*        <select disabled value={sizeId} onChange={e => setSizeId(Number(e.target.value))} className="w-full rounded border p-2" required>*/}
                    {/*            <option value="">Chọn size</option>*/}
                    {/*            {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="mb-4.5 flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-black dark:text-white mb-1">Màu sắc</label>
                            <p className="w-full rounded border p-2 bg-gray-100 dark:bg-gray-800">
                                {colors.find(c => c.id === colorId)?.name || 'Chưa chọn'}
                            </p>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-black dark:text-white mb-1">Kích cỡ</label>
                            <p className="w-full rounded border p-2 bg-gray-100 dark:bg-gray-800">
                                {sizes.find(s => s.id === sizeId)?.name || 'Chưa chọn'}
                            </p>
                        </div>
                    </div>


                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Ảnh variant</label>
                        <input type="file" accept="image/*" onChange={e => {
                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                        }} className="mb-2" />
                        {(imageFile || imageUrl) && (
                            <div className="relative group flex gap-4">
                                <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl!} alt="Preview" style={{ maxWidth: 120, borderRadius: 8 }} />
                                <button type="button" onClick={handleDeleteImageFile} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100" title="Xóa ảnh">×</button>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">Cập nhật Variant</button>
                </form>
            </div>
        </div>
    );
}
