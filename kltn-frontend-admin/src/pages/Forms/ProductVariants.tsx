import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getAllProductsForSelect } from '../../services/productService';
import { createProductVariant } from '../../services/productVariantService';
import { getProductDiscounts } from '../../services/discountService';
import { Product } from '@/types/product';
import { Color } from "@/types/color";
import { Size } from "@/types/size";
import { getColors, getSizes } from "@/services/filterService";

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

export default function AddProductVariantForm() {
  const [productId, setProductId] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [material, setMaterial] = useState('');
  const [sizeId, setSizeId] = useState<number | ''>('');
  const [colorId, setColorId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productList, colorsData, sizesData] = await Promise.all([
          getAllProductsForSelect(),
          getColors(),
          getSizes(),
        ]);
        setProducts(productList);
        setColors(colorsData);
        setSizes(sizesData);
      } catch (err) {
        toast.error('Failed to fetch initial data.');
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  const handleProductChange = async (selectedProductId: number) => {
    setProductId(selectedProductId);
    setDiscountedPrice(null);

    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      setPrice(String(product.basePrice));

      try {
        const discounts = await getProductDiscounts(selectedProductId);
        if (discounts && discounts.length > 0) {
          setDiscountedPrice(discounts[0].discountedPrice);
          toast.info(`Discount found! New price is ${discounts[0].discountedPrice.toLocaleString()}đ`);
        } else {
          setDiscountedPrice(null);
        }
      } catch (err) {
        console.error("Failed to fetch discounts:", err);
        toast.error("Could not fetch discount information for this product.");
      }
    } else {
      setPrice('');
    }
  };

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
        const generatedSku = [subCatName, brandName, colorName, sizeName].filter(Boolean).join('-');
        setSku(generatedSku);
      }
    } else {
      setSku('');
    }
  }, [productId, colorId, sizeId, products, colors, sizes]);

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
      toast.success('Product variant created successfully!');
      // Reset form
      setProductId('');
      setSku('');
      setPrice('');
      setDiscountedPrice(null);
      setStockQuantity('');
      setMaterial('');
      setSizeId('');
      setColorId('');
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create product variant.');
      toast.error(err.message || 'Failed to create product variant.');
    } finally {
      setLoading(false);
    }
  };

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
              onChange={(e) => handleProductChange(Number(e.target.value))}
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
                  placeholder="Select a product to see the price"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-200 py-3 px-5 font-medium outline-none transition dark:border-form-strokedark dark:bg-form-input"
                  readOnly
                  required
                />
                {discountedPrice !== null && (
                  <p className="mt-2 text-sm font-medium text-success">
                    After Discount: {discountedPrice.toLocaleString()}đ
                  </p>
                )}
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