import React, { useEffect, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { toast } from 'sonner';
import { Brand } from '@/types/brand';
import { getBrandsPaginated, createBrand, updateBrand, deleteBrand } from '@/services/brandService';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';

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

            <div className="space-y-6">
                <ComponentCard
                    title="All Brands"
                    headerContent={<Button onClick={openCreateModal} variant="primary">Create Brand</Button>}
                >
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">ID</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Logo</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-black dark:text-white">Loading...</td></tr>
                                ) : brands.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-black dark:text-white">No brands found.</td></tr>
                                ) : brands.map(b => (
                                    <tr key={b.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{b.id}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            {b.logoUrl ? <img src={b.logoUrl} alt={b.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded" />}
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{b.name}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{b.description}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Button variant="outline" size="sm" onClick={() => openEditModal(b)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button key={i} onClick={() => fetchBrands(i)} variant={page === i ? 'primary' : 'outline'} size="sm" className="mx-1">
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </ComponentCard>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="font-medium text-black dark:text-white mb-4">{editingBrand ? 'Edit Brand' : 'Create Brand'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-black dark:text-white mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Logo</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-black dark:text-white" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsModalOpen(false)} variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit} variant="primary">Save</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BrandListPage;
