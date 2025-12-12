import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Star, Trash2, ShoppingCart, AlertTriangle, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';

import { useAuthStore } from '@/stores/useAuthStore';
import { getReviewsByUser, deleteReview, ReviewResponse } from '@/services/reviewService';
import { mapProductToViewModel } from '@/mappers/productMapper';

interface PaginatedReviews {
    content: ReviewResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
}

const MyReviewsPage: React.FC = () => {
    const { authUser } = useAuthStore();
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOption, setSortOption] = useState<string>("updatedDate,desc");

    const sortOptions = [
        { label: "Mới cập nhật", value: "updatedDate,desc" },
        { label: "Cũ nhất", value: "createdDate,asc" },
        { label: "Mới nhất", value: "createdDate,desc" },
    ];

    const fetchReviews = async (currentPage: number, currentSort: string) => {
        if (!authUser) return;
        setLoading(true);
        try {
            const [sortBy, sortDir] = currentSort.split(',');
            const data: PaginatedReviews = await getReviewsByUser(authUser.id, currentPage, 5, sortBy, sortDir);
            setReviews(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            toast.error("Không thể tải danh sách đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Đánh giá của tôi | DAVINCI";
        if (authUser) {
            fetchReviews(page, sortOption);
        } else {
            setLoading(false);
        }
    }, [authUser, page, sortOption]);

    const handleDeleteReview = async (reviewId: number) => {
        const result = await Swal.fire({
            title: 'Xóa đánh giá?',
            text: "Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C92127',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const toastId = toast.loading("Đang xóa đánh giá...");
            try {
                await deleteReview(reviewId);
                toast.success("Đã xóa đánh giá thành công.", { id: toastId });
                setReviews(prev => prev.filter(review => review.id !== reviewId));
            } catch (error) {
                console.error("Failed to delete review:", error);
                toast.error("Không thể xóa đánh giá. Vui lòng thử lại.", { id: toastId });
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const formatDate = (dateInput: string | undefined): string => {
        if (!dateInput) return 'Không rõ';
        const date = new Date(dateInput.replace(' ', 'T')); // Handle space separator
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (!authUser) {
        return (
            <div className="container mx-auto max-w-4xl py-16 text-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Vui lòng đăng nhập</h2>
                    <p className="mt-2 text-gray-600">
                        Bạn cần đăng nhập để xem các đánh giá của mình.
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
        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                            page === i
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
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
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Đánh giá của tôi</h1>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort-reviews" className="text-sm font-medium">Sắp xếp:</label>
                    <select
                        id="sort-reviews"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse flex gap-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <MessageSquare className="mx-auto h-16 w-16 text-gray-300" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Bạn chưa có đánh giá nào</h2>
                    <p className="mt-2 text-gray-500">Hãy chia sẻ cảm nhận của bạn về các sản phẩm đã mua nhé.</p>
                    <Link
                        to="/products"
                        className="mt-6 inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <ShoppingCart className="inline-block mr-2 -mt-1" size={18} />
                        Khám phá sản phẩm
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const productViewModel = mapProductToViewModel(review.product);
                        const isEdited = review.createdDate !== review.updatedDate;
                        return (
                            <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4">
                                <Link to={productViewModel.link} className="flex-shrink-0">
                                    <img src={productViewModel.image} alt={productViewModel.title} className="w-24 h-24 rounded-md object-cover" />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link to={productViewModel.link} className="text-lg font-semibold text-gray-800 hover:text-red-600">{productViewModel.title}</Link>
                                            <div className="flex items-center mt-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-gray-400 hover:text-red-600" title="Xóa đánh giá">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600 text-sm italic">"{review.comment}"</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Đã đánh giá vào: {formatDate(review.createdDate)}
                                        {isEdited && <span className="italic"> (đã chỉnh sửa vào: {formatDate(review.updatedDate)})</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {renderPagination()}
                </div>
            )}
        </div>
    );
};

export default MyReviewsPage;
