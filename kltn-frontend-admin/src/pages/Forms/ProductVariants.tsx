import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getProductById } from '../../services/productService';
import { createProductVariant } from '../../services/productVariantService';
import { getProductDiscounts } from '../../services/discountService';
import { ProductDetailResponse } from '@/types/product';
import { Color } from "@/types/color";
import { Size } from "@/types/size";
import { getColors, getSizes } from "@/services/filterService";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';

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
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [material, setMaterial] = useState('');
  const [sizeId, setSizeId] = useState<string>('');
  const [colorId, setColorId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!productId) {
        toast.error("No product ID provided.");
        navigate('/tables/category-product-list');
        return;
      }
      try {
        setLoading(true);
        const [productData, colorsData, sizesData] = await Promise.all([
          getProductById(Number(productId)),
          getColors(),
          getSizes(),
        ]);
        
        setProduct(productData);
        setPrice(String(productData.basePrice));
        setColors(colorsData);
        setSizes(sizesData);

        const discounts = await getProductDiscounts(Number(productId));
        if (discounts && discounts.length > 0) {
          setDiscountedPrice(discounts[0].discountedPrice);
          toast.info(`Active discount found! Price is updated.`);
        }

      } catch (err) {
        toast.error('Failed to fetch initial data.');
        console.error(err);
        navigate('/tables/category-product-list');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [productId, navigate]);

  useEffect(() => {
    if (product && colorId && sizeId) {
      const color = colors.find(c => c.id === Number(colorId));
      const size = sizes.find(s => s.id === Number(sizeId));

      if (color && size) {
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
  }, [product, colorId, sizeId, colors, sizes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !sku || !price || !stockQuantity || !sizeId || !colorId || !imageFile) {
      setError('Please fill in all fields and upload an image.');
      toast.error('Please fill in all fields and upload an image.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('sku', sku);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    formData.append('material', material);
    formData.append('sizeId', String(sizeId));
    formData.append('colorId', String(colorId));
    formData.append('imageFile', imageFile);

    try {
      await createProductVariant(formData);
      toast.success('Product variant created successfully!');
      navigate(`/tables/product-list/${productId}`);
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
      <PageMeta title="Add Product Variant | Admin Dashboard" description="Add a new variant for a product" />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Add New Product Variant" />
        <Button variant="outline" onClick={() => navigate(-1)}>
            Back
        </Button>
      </div>

      <ComponentCard title="Product Variant Information">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}

          <div>
            <Label>Product</Label>
            <Input
              type="text"
              value={product ? product.name : 'Loading...'}
              className="bg-gray-200 dark:bg-form-input"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
                <Label>SKU <span className="text-meta-1">*</span></Label>
                <Input
                  type="text"
                  value={sku}
                  placeholder="SKU will be auto-generated"
                  className="bg-gray-200 dark:bg-form-input"
                  readOnly
                />
            </div>
            <div>
                <Label>Base Price <span className="text-meta-1">*</span></Label>
                <Input
                  type="number"
                  value={price}
                  className="bg-gray-200 dark:bg-form-input"
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

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
                <Label htmlFor="stockQuantity">Stock Quantity <span className="text-meta-1">*</span></Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={stockQuantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setStockQuantity(e.target.value)}
                  placeholder="Enter stock quantity"
                  required
                />
            </div>
            <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  type="text"
                  value={material}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMaterial(e.target.value)}
                  placeholder="Enter material"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label>Color <span className="text-meta-1">*</span></Label>
              <Select
                options={colors.map(c => ({ value: String(c.id), label: c.name }))}
                onChange={(value) => setColorId(value)}
                placeholder="Select Color"
                value={colorId}
              />
            </div>
            <div>
              <Label>Size <span className="text-meta-1">*</span></Label>
              <Select
                options={sizes.map(s => ({ value: String(s.id), label: s.name }))}
                onChange={(value) => setSizeId(value)}
                placeholder="Select Size"
                value={sizeId}
              />
            </div>
          </div>

          <div>
            <Label>Variant Image <span className="text-meta-1">*</span></Label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="mb-2 text-black dark:text-white"
              required
            />
            {imageFile && (
              <div className="relative group flex gap-4">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: 120, borderRadius: 8 }} />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteImageFile}
                  className="absolute top-1 right-1 !p-1 !h-6 !w-6"
                >
                  ×
                </Button>
              </div>
            )}
          </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Variant'}
            </Button>
        </form>
      </ComponentCard>
    </div>
  );
}
