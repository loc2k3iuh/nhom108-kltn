import React, { useEffect, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { toast } from 'sonner';
import { Size } from '@/types/size';
import { getSizesPaginated, createSize, updateSize, deleteSize } from '@/services/sizeService';
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

const SizeListPage: React.FC = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const fetchSizes = async (p = 0) => {
        setIsLoading(true);
        try {
            const res = await getSizesPaginated(p, 10, 'id', 'ASC');
            setSizes(res.content || []);
            setTotalPages(res.totalPages || 0);
            setPage(res.page || p);
        } catch (error: unknown) {
            console.error('Failed to fetch sizes:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes(0);
    }, []);

    const openCreateModal = () => {
        setEditingSize(null);
        setName('');
        setDescription('');
        setIsModalOpen(true);
    };

    const openEditModal = (s: Size) => {
        setEditingSize(s);
        setName(s.name);
        setDescription(s.description || '');
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error('Name is required');
        const payload = { name: name.trim(), description: description.trim() };

        try {
            if (editingSize) {
                await updateSize(editingSize.id, payload);
                toast.success('Size updated');
            } else {
                await createSize(payload);
                toast.success('Size created');
            }
            setIsModalOpen(false);
            fetchSizes(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this size?')) return;
        try {
            await deleteSize(id);
            toast.success('Size deleted');
            fetchSizes(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Delete failed');
        }
    };

    return (
        <div>
            <PageMeta title="Size Management | Admin" description="Manage product sizes" />
            <PageBreadcrumb pageTitle="Size Management" />

            <div className="space-y-6">
                <ComponentCard
                    title="All Sizes"
                    headerContent={<Button onClick={openCreateModal} variant="primary">Create Size</Button>}
                >
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">ID</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-black dark:text-white">Loading...</td></tr>
                                ) : sizes.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-black dark:text-white">No sizes found.</td></tr>
                                ) : sizes.map(s => (
                                    <tr key={s.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{s.id}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{s.name}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{s.description}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Button variant="outline" size="sm" onClick={() => openEditModal(s)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button key={i} onClick={() => fetchSizes(i)} variant={page === i ? 'primary' : 'outline'} size="sm" className="mx-1">
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </ComponentCard>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="font-medium text-black dark:text-white mb-4">{editingSize ? 'Edit Size' : 'Create Size'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-black dark:text-white mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
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

export default SizeListPage;
