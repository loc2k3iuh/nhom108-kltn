import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getCachedRootCategories, getSubCategories } from '../../services/categoryService';
import { createProduct } from '../../services/productService';
import { applyDiscountToProducts } from '../../services/discountService';
import { CategoryResponse } from '@/types/responses/categoryResponse';
import { getBrands } from "@/services/filterService";
import { Brand } from "@/types/brand";

export default function AddProductForm() {
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
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const roots = await getCachedRootCategories();
        setRootCategories(roots);
      } catch (err) {
        setError('Failed to fetch root categories.');
        console.error(err);
      }
    };
    fetchRootCategories();
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
        toast.error("Không thể tải dữ liệu bộ lọc.");
      }
    };
    fetchFilterData();
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
          console.error(err);
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
    setSuccess(null);

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
      const newProduct = await createProduct(formData);
      const discountValue = Number(discountPercent);

      if (newProduct && newProduct.id && discountValue > 0) {
        try {
          await applyDiscountToProducts({
            discountId: discountValue,
            productIds: [newProduct.id],
          });
          setSuccess(`Product created successfully and ${discountValue}% discount applied!`);
          toast.success(`Product created and ${discountValue}% discount applied!`);
        } catch (discountError: any) {
          setError(`Product created, but failed to apply discount: ${discountError.message}`);
          toast.error(`Product created, but failed to apply discount: ${discountError.message}`);
        }
      } else {
        setSuccess('Product created successfully!');
        toast.success('Product created successfully!');
      }

      // Reset form
      setProductName('');
      setDescription('');
      setBasePrice('');
      setSelectedRootCategoryId('');
      setSelectedSubCategoryId('');
      setBrandId('');
      setImages([]);
      setDiscountPercent('');
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
      <PageMeta title="Add Product | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Add New Product" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Product Information
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6.5">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-500">{success}</div>}

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Product Name <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Base Price <span className="text-meta-1">*</span>
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Enter base price"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Discount Percent (%)
            </label>
            <input
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
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Root Category <span className="text-meta-1">*</span>
              </label>
              <select
                value={selectedRootCategoryId}
                onChange={(e) => setSelectedRootCategoryId(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="">Select Root Category</option>
                {rootCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Sub Category <span className="text-meta-1">*</span>
              </label>
              <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                disabled={!selectedRootCategoryId || subCategories.length === 0}
              >
                <option value="">Select Sub Category</option>
                {subCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Brand <span className="text-meta-1">*</span>
            </label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(Number(e.target.value))}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>
          
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Product Images <span className="text-meta-1">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => {
                if (e.target.files) {
                  setImages(Array.from(e.target.files));
                }
              }}
              className="mb-2"
              required
            />
            <div className="flex flex-wrap gap-4">
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={url} className="relative group">
                    <img src={url} alt={`Preview ${idx + 1}`} style={{ maxWidth: 120, borderRadius: 8 }} />
                    <button
                      type="button"
                      onClick={() => handleDeleteImageFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                      title="Xóa ảnh"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

            <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:text-yellow-300"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Product'}
            </button>

        </form>
      </div>
    </div>
  );
}