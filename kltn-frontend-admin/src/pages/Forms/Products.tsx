import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getCachedRootCategories, getSubCategories } from '../../services/categoryService';
import { createProduct } from '../../services/productService';
import { applyDiscountToProducts } from '../../services/discountService';
import { CategoryResponse } from '@/types/responses/categoryResponse';
import { getBrands } from "@/services/filterService";
import { Brand } from "@/types/brand";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';

export default function ProductForm() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [brandId, setBrandId] = useState<number | ''>('');
  const [images, setImages] = useState<File[]>([]);
  const [discountPercent, setDiscountPercent] = useState('');

  const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState<number | ''>('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | ''>('');

  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [roots, brandsData] = await Promise.all([
          getCachedRootCategories(),
          getBrands()
        ]);
        setRootCategories(roots);
        setBrands(brandsData);
      } catch (err) {
        setError('Failed to fetch initial data.');
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedRootCategoryId) {
        try {
          setLoading(true);
          const subs = await getSubCategories(selectedRootCategoryId);
          setSubCategories(subs);
          setSelectedSubCategoryId('');
        } catch (err) {
          setError('Failed to fetch sub-categories.');
        } finally {
          setLoading(false);
        }
      } else {
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedRootCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !basePrice || !selectedSubCategoryId || !brandId || images.length === 0) {
      setError('Please fill in all required fields and upload at least one image.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('basePrice', basePrice);
    formData.append('categoryId', String(selectedSubCategoryId));
    formData.append('brandId', String(brandId));
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const savedProduct = await createProduct(formData);
      toast.success('Product created successfully!');
      
      const discountValue = Number(discountPercent);
      if (savedProduct && savedProduct.id && discountValue > 0) {
        await applyDiscountToProducts({
          discountId: discountValue,
          productIds: [savedProduct.id],
        });
        toast.success(`Discount of ${discountValue}% applied!`);
      }
      
      navigate('/tables/category-product-list');

    } catch (err: any) {
      setError(err.message || 'Failed to create product.');
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImageFile = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <PageMeta title="Add Product" />
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Add New Product" />
        <Button variant="outline" onClick={() => navigate(-1)}>
            Back
        </Button>
      </div>

      <ComponentCard title="Product Information">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}

          <div>
            <Label htmlFor="productName">Product Name <span className="text-meta-1">*</span></Label>
            <Input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="basePrice">Base Price <span className="text-meta-1">*</span></Label>
            <Input
              id="basePrice"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Enter base price"
              required
            />
          </div>

          <div>
            <Label htmlFor="discountPercent">Discount Percent (%)</Label>
            <Input
              id="discountPercent"
              type="number"
              value={discountPercent}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                  setDiscountPercent(value);
                }
              }}
              placeholder="Enter discount percentage (0-100)"
              min="0"
              max="100"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label>Root Category <span className="text-meta-1">*</span></Label>
              <Select
                options={rootCategories.map(c => ({ value: c.id, label: c.name }))}
                onChange={(value) => setSelectedRootCategoryId(Number(value))}
                placeholder="Select Root Category"
                value={selectedRootCategoryId}
              />
            </div>

            <div>
              <Label>Sub Category <span className="text-meta-1">*</span></Label>
              <Select
                options={subCategories.map(c => ({ value: c.id, label: c.name }))}
                onChange={(value) => setSelectedSubCategoryId(Number(value))}
                placeholder="Select Sub Category"
                value={selectedSubCategoryId}
                disabled={!selectedRootCategoryId || subCategories.length === 0}
              />
            </div>
          </div>

          <div>
            <Label>Brand <span className="text-meta-1">*</span></Label>
            <Select
              options={brands.map(b => ({ value: b.id, label: b.name }))}
              onChange={(value) => setBrandId(Number(value))}
              placeholder="Select Brand"
              value={brandId}
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              rows={4}
              value={description}
              onChange={(value) => setDescription(value)}
              placeholder="Enter product description"
            />
          </div>
          
          <div>
            <Label>Product Images <span className="text-meta-1">*</span></Label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => {
                if (e.target.files) {
                  setImages(Array.from(e.target.files));
                }
              }}
              className="mb-2 text-black dark:text-white"
              required
            />
            <div className="flex flex-wrap gap-4">
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={url} className="relative group">
                    <img src={url} alt={`Preview ${idx + 1}`} style={{ maxWidth: 120, borderRadius: 8 }} />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteImageFile(idx)}
                      className="absolute top-1 right-1 !p-1 !h-6 !w-6"
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Product'}
            </Button>

        </form>
      </ComponentCard>
    </div>
  );
}
