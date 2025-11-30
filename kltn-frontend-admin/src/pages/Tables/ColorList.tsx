import React, { useEffect, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { toast } from 'sonner';
import { Color } from '@/types/color';
import { getColorsPaginated, createColor, updateColor, deleteColor } from '@/services/colorService';
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

const ColorListPage: React.FC = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const fetchColors = async (p = 0) => {
        setIsLoading(true);
        try {
            const res = await getColorsPaginated(p, 10, 'id', 'ASC');
            setColors(res.content || []);
            setTotalPages(res.totalPages || 0);
            setPage(res.page || p);
        } catch (error: unknown) {
            console.error('Failed to fetch colors:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchColors(0);
    }, []);

    const openCreateModal = () => {
        setEditingColor(null);
        setName('');
        setDescription('');
        setIsModalOpen(true);
    };

    const openEditModal = (c: Color) => {
        setEditingColor(c);
        setName(c.name);
        setDescription(c.description || '');
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error('Name is required');
        const payload = { name: name.trim(), description: description.trim() };

        try {
            if (editingColor) {
                await updateColor(editingColor.id, payload);
                toast.success('Color updated');
            } else {
                await createColor(payload);
                toast.success('Color created');
            }
            setIsModalOpen(false);
            fetchColors(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this color?')) return;
        try {
            await deleteColor(id);
            toast.success('Color deleted');
            fetchColors(page);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Delete failed');
        }
    };

    return (
        <div>
            <PageMeta title="Color Management | Admin" description="Manage product colors" />
            <PageBreadcrumb pageTitle="Color Management" />

            <div className="space-y-6">
                <ComponentCard
                    title="All Colors"
                    headerContent={<Button onClick={openCreateModal} variant="primary">Create Color</Button>}
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
                                ) : colors.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-black dark:text-white">No colors found.</td></tr>
                                ) : colors.map(c => (
                                    <tr key={c.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.id}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.name}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.description}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Button variant="outline" size="sm" onClick={() => openEditModal(c)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button key={i} onClick={() => fetchColors(i)} variant={page === i ? 'primary' : 'outline'} size="sm" className="mx-1">
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </ComponentCard>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="font-medium text-black dark:text-white mb-4">{editingColor ? 'Edit Color' : 'Create Color'}</h3>
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

export default ColorListPage;
