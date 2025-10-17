import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { getProductVariantById, updateProductVariant } from "@/services/productVariantService.ts";
import { ProductVariant } from '@/types/product';

const mockColors = [
    { id: 1, name: 'Đỏ' }, { id: 2, name: 'Xanh dương' }, { id: 3, name: 'Xanh lá' },
    { id: 4, name: 'Đen' }, { id: 5, name: 'Trắng' }, { id: 6, name: 'Xám' },
    { id: 7, name: 'Hồng' }, { id: 8, name: 'Vàng' }, { id: 9, name: 'Nâu' },
    { id: 10, name: 'Tím' }, { id: 11, name: 'Cam' }, { id: 12, name: 'Be' },
    { id: 13, name: 'Xanh navy' }, { id: 14, name: 'Xanh mint' }, { id: 15, name: 'Hồng pastel' }
];
const mockSizes = [
    { id: 1, name: 'XS' }, { id: 2, name: 'S' }, { id: 3, name: 'M' },
    { id: 4, name: 'L' }, { id: 5, name: 'XL' }, { id: 6, name: 'XXL' },
    { id: 7, name: 'XXXL' }, { id: 8, name: 'Free Size' }, { id: 9, name: '38' },
    { id: 10, name: '39' }, { id: 11, name: '40' }, { id: 12, name: '41' },
    { id: 13, name: '42' }, { id: 14, name: '43' }, { id: 15, name: '44' }
];

export default function EditVariant() {

    const { variantId } = useParams<{ variantId: string }>();
    const id = Number(variantId);

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

    useEffect(() => {
        const fetchVariant = async () => {
            setLoading(true);
            try {
                const data = await getProductVariantById(id);
                setVariant(data);
                setSku(data.sku || '');
                setPrice(data.price ? String(data.price) : '');
                setStockQuantity(data.stockQuantity ? String(data.stockQuantity) : '');
                setMaterial(data.material || '');
                setSizeId(data.size?.id || '');
                setColorId(data.color?.id || '');
                setImageUrl(data.imageUrl || null);
            } catch (err: any) {
                setError('Không thể tải dữ liệu variant.');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchVariant();
        }
    }, [id]);

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
            setTimeout(() => navigate(-1), 1200);
        } catch (err: any) {
            setError(err.message || 'Cập nhật thất bại.');
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
                        <input type="text" value={sku} onChange={e => setSku(e.target.value)} maxLength={100} className="w-full rounded border p-2" required />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Giá</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} min={0} step="0.01" className="w-full rounded border p-2" required />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Số lượng tồn kho</label>
                        <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} min={0} className="w-full rounded border p-2" required />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Chất liệu</label>
                        <input type="text" value={material} onChange={e => setMaterial(e.target.value)} maxLength={255} className="w-full rounded border p-2" />
                    </div>
                    <div className="mb-4.5 flex gap-4">
                        <div className="w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Màu sắc</label>
                            <select value={colorId} onChange={e => setColorId(Number(e.target.value))} className="w-full rounded border p-2" required>
                                <option value="">Chọn màu</option>
                                {mockColors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Kích cỡ</label>
                            <select value={sizeId} onChange={e => setSizeId(Number(e.target.value))} className="w-full rounded border p-2" required>
                                <option value="">Chọn size</option>
                                {mockSizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
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



                    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-primary-hover">Update Variant</button>
                </form>
            </div>
        </div>
    );
}
