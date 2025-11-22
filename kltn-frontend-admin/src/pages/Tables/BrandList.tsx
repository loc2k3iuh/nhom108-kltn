import React, { useEffect, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { toast } from 'sonner';
import { Brand } from '@/types/brand';
import { getBrandsPaginated, createBrand, updateBrand, deleteBrand } from '@/services/brandService';

const getErrorMessage = (error: unknown) => {
    if (!error) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    // @ts-ignore
    return error?.message || 'Unknown error';
};

const BrandListPage: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Create/Edit form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const fetchBrands = async (p = 0) => {
        setIsLoading(true);
        try {
            const res = await getBrandsPaginated(p, 10, 'id', 'ASC');
            setBrands(res.content || []);
            setTotalPages(res.totalPages || 0);
            setPage(res.page || p);
        } catch (error: unknown) {
            console.error('Failed to fetch brands:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands(0);
    }, []);

    const openCreateModal = () => {
        setEditingBrand(null);
        setName('');
        setDescription('');
        setLogoFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (b: Brand) => {
        setEditingBrand(b);
        setName(b.name);
        setDescription(b.description);
        setLogoFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) setLogoFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error('Name is required');
        const form = new FormData();
        form.append('name', name);
        form.append('description', description);
        if (logoFile) form.append('logoFile', logoFile);

        try {
            if (editingBrand) {
                await updateBrand(editingBrand.id, form);
                toast.success('Brand updated');
            } else {
                await createBrand(form);
                toast.success('Brand created');
            }
            setIsModalOpen(false);
            fetchBrands(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return;
        try {
            await deleteBrand(id);
            toast.success('Brand deleted');
            fetchBrands(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Delete failed');
        }
    };

    return (
        <div>
            <PageMeta title="Brand Management | Admin" description="Manage product brands" />
            <PageBreadcrumb pageTitle="Brand Management" />

            <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">Brands</h3>
                    <div>
                        <button onClick={openCreateModal} className="rounded bg-primary px-4 py-2 text-white">Create Brand</button>
                    </div>
                </div>

                <div className="mt-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Logo</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
                            ) : brands.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-6">No brands found.</td></tr>
                            ) : brands.map(b => (
                                <tr key={b.id}>
                                    <td className="py-3 px-4">{b.id}</td>
                                    <td className="py-3 px-4">
                                        {b.logoUrl ? <img src={b.logoUrl} alt={b.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-200" />}
                                    </td>
                                    <td className="py-3 px-4">{b.name}</td>
                                    <td className="py-3 px-4">{b.description}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(b)} className="text-blue-500">Edit</button>
                                            <button onClick={() => handleDelete(b.id)} className="text-red-500">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => fetchBrands(i)} className={`mx-1 px-3 py-1 rounded ${page === i ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-meta-4'}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="w-full max-w-lg rounded bg-white p-6 dark:bg-boxdark">
                        <h3 className="font-medium mb-4">{editingBrand ? 'Edit Brand' : 'Create Brand'}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block mb-1">Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div>
                                <label className="block mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div>
                                <label className="block mb-1">Logo</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                            <button onClick={handleSubmit} className="px-4 py-2 rounded bg-primary text-white">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandListPage;

