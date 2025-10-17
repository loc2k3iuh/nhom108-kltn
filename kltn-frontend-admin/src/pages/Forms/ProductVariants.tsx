import { useState, useEffect } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getAllProductsForSelect } from '../../services/productService';
import { createProductVariant } from '../../services/productVariantService';
import { Product } from '@/types/product';

import { Color } from "@/types/color";
import { Size } from "@/types/size";
import { getColors, getSizes } from "@/services/filterService";



// Updated helper to robustly remove diacritics for SKU
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
    // Remove any remaining special characters and spaces
    str = str.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '');
    return str.toUpperCase();
};

export default function AddProductVariantForm() {
  const [productId, setProductId] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [material, setMaterial] = useState('');
  const [sizeId, setSizeId] = useState<number | ''>('');
  const [colorId, setColorId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProductsForSelect();
        setProducts(productList);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [ colorsData, sizesData] = await Promise.all([
                    getColors(),
                    getSizes()
                ]);
                setColors(colorsData);
                setSizes(sizesData);
            } catch (error) {
                console.error("Failed to fetch filter data:", error);
                toast.error("Không thể tải dữ liệu bộ lọc.");
            }
        };
        fetchFilterData();
    }, []);

  // Auto-generate SKU based on the specified format
  useEffect(() => {
    if (productId && colorId && sizeId) {
      const product = products.find(p => p.id === productId);
      const color = colors.find(c => c.id === colorId);
      const size = sizes.find(s => s.id === sizeId);

      if (product && color && size) {
        const subCatName = toSkuString(product.category.name);
        const brandName = toSkuString(product.brand.name);
        const colorName = toSkuString(color.name);
        const sizeName = toSkuString(size.name);

        // SKU format: <SUB_CATEGORY_NAME>-<BRAND_NAME>-<COLOR_NAME>-<SIZE_NAME>
        const skuParts = [subCatName, brandName, colorName, sizeName];
        const generatedSku = skuParts.filter(Boolean).join('-'); // Filter out empty parts and join
        setSku(generatedSku);
      }
    } else {
      setSku('');
    }
  }, [productId, colorId, sizeId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !sku || !price || !stockQuantity || !sizeId || !colorId || !imageFile) {
      setError('Please fill in all fields and upload an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('productId', String(productId));
    formData.append('sku', sku);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    formData.append('material', material);
    formData.append('sizeId', String(sizeId));
    formData.append('colorId', String(colorId));
    formData.append('imageFile', imageFile);

    try {
      await createProductVariant(formData);
      setSuccess('Product variant created successfully!');
      // Reset form
      setProductId('');
      setSku('');
      setPrice('');
      setStockQuantity('');
      setMaterial('');
      setSizeId('');
      setColorId('');
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create product variant.');
    } finally {
      setLoading(false);
    }
  };

  // Xóa file khỏi imageFile
  const handleDeleteImageFile = () => {
    setImageFile(null);
  };

  return (
    <div>
      <PageMeta title="Add Product Variant | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Add New Product Variant" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Product Variant Information
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6.5">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-500">{success}</div>}

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Product <span className="text-meta-1">*</span>
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                SKU <span className="text-meta-1">*</span>
                </label>
                <input
                type="text"
                value={sku}
                placeholder="SKU will be auto-generated"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-200 py-3 px-5 font-medium outline-none transition dark:border-form-strokedark dark:bg-form-input"
                readOnly
                />
            </div>
            <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                Price <span className="text-meta-1">*</span>
                </label>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter variant price"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                required
                />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                Stock Quantity <span className="text-meta-1">*</span>
                </label>
                <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="Enter stock quantity"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                required
                />
            </div>
            <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                Material
                </label>
                <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Enter material"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Color <span className="text-meta-1">*</span>
              </label>
              <select
                value={colorId}
                onChange={(e) => setColorId(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="">Select Color</option>
                {colors.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Size <span className="text-meta-1">*</span>
              </label>
              <select
                value={sizeId}
                onChange={(e) => setSizeId(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="">Select Size</option>
                {sizes.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Variant Image <span className="text-meta-1">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="mb-2"
              required
            />
            {imageFile && (
              <div className="relative group flex gap-4">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: 120, borderRadius: 8 }} />
                <button
                  type="button"
                  onClick={handleDeleteImageFile}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                  title="Xóa ảnh"
                >
                  ×
                </button>
              </div>
            )}
          </div>

            <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:text-yellow-300"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Variant'}
            </button>
        </form>
      </div>
    </div>
  );
}