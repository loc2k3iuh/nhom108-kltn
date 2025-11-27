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

    // View mode: paginated list or tree by root categories
    const [viewMode, setViewMode] = useState<'paginated' | 'tree'>('paginated');
    const [treeData, setTreeData] = useState<{ category: CategoryResponse; subCategories: CategoryResponse[] }[]>([]);
    const [isTreeLoading, setIsTreeLoading] = useState(false);
    const [expandedRootIds, setExpandedRootIds] = useState<number[]>([]);

    // Create/Edit form state
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
            // Use service to fetch roots then subcategories for each
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
                // If editing and type is root, ensure parentId is undefined
                const pid = createType === 'root' ? undefined : parentId;
                await updateCategory(editingCategory.id, name, description, pid);
                toast.success('Category updated');
            } else {
                const pid = createType === 'root' ? undefined : parentId;
                await createCategory(name, description, pid);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            // refresh relevant data
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

            <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">Categories</h3>
                    <div className="flex items-center gap-3">
                        <div>
                            <button onClick={() => setViewMode('paginated')} className={`px-3 py-1 rounded ${viewMode === 'paginated' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Paginated</button>
                            <button onClick={() => setViewMode('tree')} className={`ml-2 px-3 py-1 rounded ${viewMode === 'tree' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Roots Tree</button>
                        </div>
                        <div>
                            <button onClick={() => openCreateModal('root')} className="ml-2 rounded border px-4 py-2">Create Root</button>
                            <button onClick={() => openCreateModal('sub')} className="ml-2 rounded border px-4 py-2">Create Sub</button>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {viewMode === 'paginated' ? (
                        <>
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Name</th>
                                        <th className="py-3 px-4">Description</th>
                                        <th className="py-3 px-4">Parent</th>
                                        <th className="py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
                                    ) : categories.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-6">No categories found.</td></tr>
                                    ) : categories.map(c => (
                                        <tr key={c.id}>
                                            <td className="py-3 px-4">{c.id}</td>
                                            <td className="py-3 px-4">{c.name}</td>
                                            <td className="py-3 px-4">{c.description}</td>
                                            <td className="py-3 px-4">{c.parentCategory ? c.parentCategory.name : '-'}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(c)} className="text-blue-500">Edit</button>
                                                    <button onClick={() => handleDelete(c.id)} className="text-red-500">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-center mt-4">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} onClick={() => fetchCategories(i)} className={`mx-1 px-3 py-1 rounded ${page === i ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-meta-4'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div>
                            {isTreeLoading ? (
                                <div className="text-center py-6">Loading tree...</div>
                            ) : treeData.length === 0 ? (
                                <div className="text-center py-6">No root categories found.</div>
                            ) : (
                                <div className="space-y-3">
                                    {treeData.map(({ category, subCategories }) => (
                                        <div key={category.id} className="border rounded p-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <button onClick={() => toggleExpand(category.id)} className="mr-3">{expandedRootIds.includes(category.id) ? '-' : '+'}</button>
                                                    <strong>{category.name}</strong>
                                                    <div className="text-sm">{category.description}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(category)} className="text-blue-500">Edit</button>
                                                    <button onClick={() => handleDelete(category.id)} className="text-red-500">Delete</button>
                                                </div>
                                            </div>

                                            {expandedRootIds.includes(category.id) && (
                                                <div className="mt-3">
                                                    {subCategories.length === 0 ? (
                                                        <div className="text-sm">No subcategories.</div>
                                                    ) : (
                                                        <ul className="pl-6 list-disc">
                                                            {subCategories.map(s => (
                                                                <li key={s.id} className="flex justify-between items-center">
                                                                    <div>
                                                                        <span className="font-medium">{s.name}</span>
                                                                        <div className="text-sm ">{s.description}</div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button onClick={() => openEditModal(s)} className="text-blue-500">Edit</button>
                                                                        <button onClick={() => handleDelete(s.id)} className="text-red-500">Delete</button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <div className="mt-2">
                                                        <button onClick={() => openCreateModal('sub')}
                                                            className="px-3 py-1 rounded bg-primary text-white">Create Subcategory</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="w-full max-w-lg rounded bg-white p-6 dark:bg-boxdark">
                        <h3 className="font-medium mb-4">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block mb-1">Type</label>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="type" checked={createType === 'root'} onChange={() => setCreateType('root')} />
                                        <span>Root</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="type" checked={createType === 'sub'} onChange={() => setCreateType('sub')} />
                                        <span>Subcategory</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div>
                                <label className="block mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border p-2 dark:bg-form-input" />
                            </div>
                            <div>
                                <label className="block mb-1">Parent (only for Subcategory)</label>
                                <select value={parentId ?? ''} onChange={e => setParentId(e.target.value ? Number(e.target.value) : undefined)} disabled={createType === 'root'} className="w-full rounded border p-2 dark:bg-form-input">
                                    <option value="">-- Select parent root --</option>
                                    {rootCategories.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
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

export default CategoryListPage;

