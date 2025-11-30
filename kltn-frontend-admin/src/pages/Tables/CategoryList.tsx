import React, { useEffect, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { toast } from 'sonner';
import { CategoryResponse } from '@/types/responses/categoryResponse';
import {
    getCategoriesPaginated,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getRootCategories,
    getSubCategories,
} from '@/services/categoryService';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Select from '@/components/form/Select';

const getErrorMessage = (error: unknown) => {
    if (!error) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    // @ts-ignore
    return error?.message || 'Unknown error';
};

const CategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [viewMode, setViewMode] = useState<'paginated' | 'tree'>('paginated');
    const [treeData, setTreeData] = useState<{ category: CategoryResponse; subCategories: CategoryResponse[] }[]>([]);
    const [isTreeLoading, setIsTreeLoading] = useState(false);
    const [expandedRootIds, setExpandedRootIds] = useState<number[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState<number | undefined>(undefined);
    const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
    const [createType, setCreateType] = useState<'root' | 'sub'>('root');

    const fetchCategories = async (p = 0) => {
        setIsLoading(true);
        try {
            const res = await getCategoriesPaginated(p, 10, 'id', 'ASC');
            setCategories(res.content || []);
            setTotalPages(res.totalPages || 0);
            setPage(res.page || p);
        } catch (error: unknown) {
            console.error('Failed to fetch categories:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRootCategories = async () => {
        try {
            const all = await getAllCategories();
            const roots = all.filter(c => !c.parentCategory);
            setRootCategories(roots);
        } catch (error: unknown) {
            console.warn('Failed to fetch root categories', error);
        }
    };

    const fetchTree = async () => {
        setIsTreeLoading(true);
        try {
            const roots = await getRootCategories();
            const promises = roots.map(async (r) => {
                try {
                    const subs = await getSubCategories(r.id);
                    return { category: r, subCategories: subs };
                } catch (err) {
                    console.warn(`Failed to fetch subcategories for ${r.name}`, err);
                    return { category: r, subCategories: [] };
                }
            });
            const results = await Promise.all(promises);
            setTreeData(results);
        } catch (error) {
            console.error('Failed to fetch category tree', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsTreeLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(0);
        fetchRootCategories();
    }, []);

    useEffect(() => {
        if (viewMode === 'tree') fetchTree();
    }, [viewMode]);

    const openCreateModal = (type: 'root' | 'sub' = 'root') => {
        setEditingCategory(null);
        setName('');
        setDescription('');
        setCreateType(type);
        setParentId(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (c: CategoryResponse) => {
        setEditingCategory(c);
        setName(c.name);
        setDescription(c.description || '');
        setParentId(c.parentCategory?.id);
        setCreateType(c.parentCategory ? 'sub' : 'root');
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error('Name is required');

        try {
            if (editingCategory) {
                const pid = createType === 'root' ? undefined : parentId;
                await updateCategory(editingCategory.id, name, description, pid);
                toast.success('Category updated');
            } else {
                const pid = createType === 'root' ? undefined : parentId;
                await createCategory(name, description, pid);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            if (viewMode === 'tree') {
                fetchTree();
            }
            fetchCategories(page);
            fetchRootCategories();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted');
            if (viewMode === 'tree') fetchTree();
            fetchCategories(page);
            fetchRootCategories();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || 'Delete failed');
        }
    };

    const toggleExpand = (rootId: number) => {
        setExpandedRootIds((prev) =>
            prev.includes(rootId) ? prev.filter(id => id !== rootId) : [...prev, rootId]
        );
    };

    return (
        <div>
            <PageMeta title="Category Management | Admin" description="Manage product categories" />
            <PageBreadcrumb pageTitle="Category Management" />

            <div className="space-y-6">
                <ComponentCard
                    title="All Categories"
                    headerContent={
                        <div className="flex items-center gap-3">
                            <Button onClick={() => setViewMode('paginated')} variant={viewMode === 'paginated' ? 'primary' : 'outline'} size="sm">Paginated</Button>
                            <Button onClick={() => setViewMode('tree')} variant={viewMode === 'tree' ? 'primary' : 'outline'} size="sm">Roots Tree</Button>
                            <Button onClick={() => openCreateModal('root')} variant="secondary" size="sm">Create Root</Button>
                            <Button onClick={() => openCreateModal('sub')} variant="secondary" size="sm">Create Sub</Button>
                        </div>
                    }
                >
                    {viewMode === 'paginated' ? (
                        <>
                            <div className="max-w-full overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">ID</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Parent</th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan={5} className="text-center py-10 text-black dark:text-white">Loading...</td></tr>
                                        ) : categories.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-10 text-black dark:text-white">No categories found.</td></tr>
                                        ) : categories.map(c => (
                                            <tr key={c.id}>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.id}</td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.name}</td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.description}</td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-black dark:text-white">{c.parentCategory ? c.parentCategory.name : '-'}</td>
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
                                    <Button key={i} onClick={() => fetchCategories(i)} variant={page === i ? 'primary' : 'outline'} size="sm" className="mx-1">
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            {isTreeLoading ? (
                                <div className="text-center py-10 text-black dark:text-white">Loading tree...</div>
                            ) : treeData.length === 0 ? (
                                <div className="text-center py-10 text-black dark:text-white">No root categories found.</div>
                            ) : (
                                treeData.map(({ category, subCategories }) => (
                                    <div key={category.id} className="border rounded p-3 dark:border-strokedark">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Button onClick={() => toggleExpand(category.id)} variant="outline" size="sm" className="mr-3">{expandedRootIds.includes(category.id) ? '-' : '+'}</Button>
                                                <div>
                                                    <strong className="text-black dark:text-white">{category.name}</strong>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{category.description}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3.5">
                                                <Button variant="outline" size="sm" onClick={() => openEditModal(category)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>Delete</Button>
                                            </div>
                                        </div>

                                        {expandedRootIds.includes(category.id) && (
                                            <div className="mt-4 pl-10">
                                                {subCategories.length === 0 ? (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">No subcategories.</div>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {subCategories.map(s => (
                                                            <li key={s.id} className="flex justify-between items-center">
                                                                <div>
                                                                    <span className="font-medium text-black dark:text-white">{s.name}</span>
                                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{s.description}</div>
                                                                </div>
                                                                <div className="flex items-center space-x-3.5">
                                                                    <Button variant="outline" size="sm" onClick={() => openEditModal(s)}>Edit</Button>
                                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </ComponentCard>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="font-medium text-black dark:text-white mb-4">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-black dark:text-white mb-1">Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-black dark:text-white">
                                    <input type="radio" name="type" checked={createType === 'root'} onChange={() => setCreateType('root')} />
                                    Root
                                </label>
                                <label className="flex items-center gap-2 text-black dark:text-white">
                                    <input type="radio" name="type" checked={createType === 'sub'} onChange={() => setCreateType('sub')} />
                                    Subcategory
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-black dark:text-white mb-1">Parent (for Subcategory)</label>
                            <Select
                                options={[{ value: '', label: '-- Select parent root --' }, ...rootCategories.map(r => ({ value: r.id, label: r.name }))]}
                                value={parentId}
                                onChange={(value) => setParentId(value ? Number(value) : undefined)}
                                disabled={createType === 'root'}
                            />
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

export default CategoryListPage;
