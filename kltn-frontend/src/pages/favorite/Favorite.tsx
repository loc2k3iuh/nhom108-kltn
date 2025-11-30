import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Loader2, Trash2, ShoppingCart, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

import { useAuthStore } from '@/stores/useAuthStore';
import { getUserFavorites, removeFavorite } from '@/services/favoriteService';
import { mapProductToViewModel, ProductViewModel } from '@/mappers/productMapper';
import { Product } from '@/types/product';

interface FavoriteItem {
    id: number;
    userId: number;
    product: Product;
    createdDate: string;
}

interface PaginatedFavorites {
    content: FavoriteItem[];
    totalPages: number;
    totalElements: number;
    number: number;
}

const FavoritePage: React.FC = () => {
    const { authUser } = useAuthStore();
    const [favorites, setFavorites] = useState<ProductViewModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchFavorites = async (currentPage: number) => {
        if (!authUser) return;
        setLoading(true);
        try {
            const data: PaginatedFavorites = await getUserFavorites(authUser.id, currentPage, 8);
            const mappedProducts = data.content.map(fav => mapProductToViewModel(fav.product));
            setFavorites(mappedProducts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
            toast.error("Không thể tải danh sách yêu thích.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Danh sách yêu thích | DAVINCI";
        if (authUser) {
            fetchFavorites(page);
        } else {
            setLoading(false);
        }
    }, [authUser, page]);

    const handleRemoveFavorite = async (productId: number) => {
        if (!authUser) return;

        const result = await Swal.fire({
            title: 'Xóa sản phẩm?',
            text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C92127',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const toastId = toast.loading("Đang xóa sản phẩm...");
            try {
                await removeFavorite({ userId: authUser.id, productId });
                toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích.", { id: toastId });
                // Refresh the list
                setFavorites(prev => prev.filter(fav => fav.id !== productId));
            } catch (error) {
                console.error("Failed to remove favorite:", error);
                toast.error("Không thể xóa sản phẩm. Vui lòng thử lại.", { id: toastId });
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (!authUser) {
        return (
            <div className="container mx-auto max-w-4xl py-16 text-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Vui lòng đăng nhập</h2>
                    <p className="mt-2 text-gray-600">
                        Bạn cần đăng nhập để xem danh sách sản phẩm yêu thích của mình.
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(0, page - 2);
            let endPage = Math.min(totalPages - 1, page + 2);

            if (page < 2) {
                endPage = maxPagesToShow - 1;
            }
            if (page > totalPages - 3) {
                startPage = totalPages - maxPagesToShow;
            }

            if (startPage > 0) {
                pageNumbers.push(0);
                if (startPage > 1) {
                    pageNumbers.push(-1); // Ellipsis
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                if (endPage < totalPages - 2) {
                    pageNumbers.push(-1); // Ellipsis
                }
                pageNumbers.push(totalPages - 1);
            }
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                {pageNumbers.map((p, index) =>
                    p === -1 ? (
                        <span key={`ellipsis-${index}`} className="px-2">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                                page === p
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {p + 1}
                        </button>
                    )
                )}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl font-bold text-gray-800">Danh sách yêu thích</h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                            <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Heart className="mx-auto h-16 w-16 text-gray-300" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Danh sách yêu thích của bạn trống</h2>
                    <p className="mt-2 text-gray-500">Hãy bắt đầu khám phá và thêm những sản phẩm bạn yêu thích vào đây nhé!</p>
                    <Link
                        to="/products"
                        className="mt-6 inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <ShoppingCart className="inline-block mr-2 -mt-1" size={18} />
                        Bắt đầu mua sắm
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group relative">
                                <button
                                    onClick={() => handleRemoveFavorite(product.id)}
                                    className="absolute top-2 right-2 z-10 p-2 bg-white/70 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all"
                                    title="Xóa khỏi yêu thích"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <Link to={product.link} className="block">
                                    <div className="h-48 overflow-hidden relative rounded-t-lg">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {product.discountPercent > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                {product.discountLabel}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 h-10">
                                            {product.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-red-600">
                                                {product.specialPrice}
                                            </span>
                                            <span className="text-xs text-gray-500 line-through">
                                                {product.oldPrice}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span>{(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0})</span>
                                            </div>
                                            <span>Đã bán: {product.soldCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {renderPagination()}
                </>
            )}
        </div>
    );
};

export default FavoritePage;
