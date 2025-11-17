import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Loader2, Trash2, ShoppingCart, AlertTriangle } from 'lucide-react';
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
        setPage(newPage);
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
                        to="/signin"
                        className="mt-6 inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

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
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`mx-1 px-3 py-1 rounded ${page === i ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FavoritePage;
