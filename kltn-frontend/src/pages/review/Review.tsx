import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Edit, Trash2, Loader, AlertCircle, Search, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import UserSidebar from '../../components/UserSidebar';

import '../custom.css'; // Import your CSS file for styles

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    productId: number;
    product: {
        id: number;
        productName: string;
        imageUrl: string;
        price: number;
    };
}

// Static data for user
const staticUserData = {
    id: 1,
    username: "user123",
    email: "user@example.com",
    fullName: "Người dùng mẫu",
    phone: "0123456789"
};

// Static data for reviews
const staticReviews: Review[] = [
    {
        id: 1,
        rating: 5,
        comment: "Sản phẩm rất tốt, chất lượng vượt mong đợi. Giao hàng nhanh, đóng gói cẩn thận.",
        createdAt: "2024-01-15T10:30:00",
        updatedAt: "2024-01-15T10:30:00",
        userId: 1,
        productId: 101,
        product: {
            id: 101,
            productName: "iPhone 15 Pro Max 256GB",
            imageUrl: "/public/vite.svg",
            price: 34990000
        }
    },
    {
        id: 2,
        rating: 4,
        comment: "Laptop chạy mượt, thiết kế đẹp. Tuy nhiên pin hơi yếu một chút.",
        createdAt: "2024-02-10T14:20:00",
        updatedAt: "2024-02-10T14:20:00",
        userId: 1,
        productId: 102,
        product: {
            id: 102,
            productName: "MacBook Air M2 13 inch",
            imageUrl: "/public/vite.svg",
            price: 28990000
        }
    },
    {
        id: 3,
        rating: 5,
        comment: "Tai nghe chất lượng âm thanh tuyệt vời, chống ồn rất hiệu quả.",
        createdAt: "2024-03-05T16:45:00",
        updatedAt: "2024-03-05T16:45:00",
        userId: 1,
        productId: 103,
        product: {
            id: 103,
            productName: "AirPods Pro 2nd Generation",
            imageUrl: "/public/vite.svg",
            price: 5990000
        }
    },
    {
        id: 4,
        rating: 3,
        comment: "Sản phẩm ổn, tuy nhiên có một số lỗi nhỏ về phần mềm.",
        createdAt: "2024-03-20T09:15:00",
        updatedAt: "2024-03-20T09:15:00",
        userId: 1,
        productId: 104,
        product: {
            id: 104,
            productName: "Samsung Galaxy S24 Ultra",
            imageUrl: "/public/vite.svg",
            price: 31990000
        }
    }
];

const UserReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [deletingReviewIds, setDeletingReviewIds] = useState<number[]>([]);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editRating, setEditRating] = useState<number>(0);
    const [editComment, setEditComment] = useState<string>('');

    const navigate = useNavigate();

    // Load static data on component mount
    useEffect(() => {
        const loadStaticData = () => {
            setLoading(true);
            setError(null);

            // Simulate loading delay
            setTimeout(() => {
                setReviews(staticReviews);
                setFilteredReviews(staticReviews);
                setLoading(false);
            }, 1000);
        };

        loadStaticData();
    }, []);

    // Filter reviews based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredReviews(reviews);
            return;
        }

        const results = reviews.filter(review =>
            review.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredReviews(results);
    }, [searchTerm, reviews]);

    // Delete a review
    const deleteReview = async (reviewId: number) => {
        try {
            setDeletingReviewIds(prev => [...prev, reviewId]);

            // Confirm deletion
            const result = await Swal.fire({
                title: 'Xóa đánh giá?',
                text: 'Bạn có chắc muốn xóa đánh giá này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
            });

            if (!result.isConfirmed) {
                setDeletingReviewIds(prev => prev.filter(id => id !== reviewId));
                return;
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update state
            setReviews(prev => prev.filter(review => review.id !== reviewId));
            toast.success('Đã xóa đánh giá thành công');
        } catch (err) {
            toast.error('Xóa đánh giá thất bại');
            console.error('Error deleting review:', err);
        } finally {
            setDeletingReviewIds(prev => prev.filter(id => id !== reviewId));
        }
    };

    // Begin editing a review
    const startEditReview = (review: Review) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);

        // Open modal
        const modalElement = document.getElementById('edit-review-modal');
        if (modalElement) {
            (modalElement as any).showModal();
        }
    };

    // Submit edited review
    const submitEditedReview = async () => {
        if (!editingReview) return;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update review in the list
            setReviews(prev => prev.map(review =>
                review.id === editingReview.id
                    ? { ...review, rating: editRating, comment: editComment, updatedAt: new Date().toISOString() }
                    : review
            ));

            toast.success('Đã cập nhật đánh giá thành công');

            // Close modal
            const modalElement = document.getElementById('edit-review-modal');
            if (modalElement) {
                (modalElement as any).close();
            }
        } catch (err) {
            toast.error('Cập nhật đánh giá thất bại');
            console.error('Error updating review:', err);
        }
    };

    // Format date
    const formatDate = (dateInput: string | number[]): string => {
        let date: Date;

        if (Array.isArray(dateInput)) {
            // Handle array format [year, month, day, hour, minute, second]
            const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
            // Note: JavaScript months are 0-indexed (0 = January, 11 = December)
            // But it looks like the input array has 1-indexed months, so we subtract 1
            date = new Date(year, month - 1, day, hour, minute, second);
        } else {
            // Handle string format
            date = new Date(dateInput);
        }

        // Return formatted date
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get user data for the sidebar
    const userData = staticUserData;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar userData={userData} />

                {/* Main Content */}
                <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <Star className="text-yellow-500 mr-2" size={24} />
                                <h1 className="text-xl font-bold">Đánh giá của tôi</h1>
                            </div>

                            {/* Search */}
                            <div className="w-full sm:w-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm đánh giá..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <AlertCircle className="text-red-500 mr-2" size={24} />
                                    <p className="text-red-500">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading ? (
                            <div className="space-y-4 mb-6">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
                                        <div className="flex items-start gap-4">
                                            <div className="h-16 w-16 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
                                                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                                <div className="flex justify-between">
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <Star className="mx-auto text-gray-400 mb-4" size={64} />
                                <h3 className="text-xl font-semibold mb-2 text-gray-700">Bạn chưa có đánh giá nào</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm ? 'Không tìm thấy đánh giá nào phù hợp với tìm kiếm của bạn.' : 'Đánh giá sản phẩm sẽ hiển thị tại đây.'}
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                    Khám phá sản phẩm
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6">
                                {filteredReviews.map((review) => (
                                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Product Image */}
                                            <div
                                                className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                                                onClick={() => navigate(`/product?id=${review.productId}`)}
                                            >
                                                <img
                                                    src={review.product.imageUrl}
                                                    alt={review.product.productName}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1">
                                                <h3
                                                    className="font-medium text-gray-900 mb-1 hover:text-red-500 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/product?id=${review.productId}`)}
                                                >
                                                    {review.product.productName}
                                                </h3>

                                                {/* Rating */}
                                                <div className="flex items-center mb-2">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            size={16}
                                                            className={index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">
                            {review.rating}/5
                          </span>
                                                </div>

                                                {/* Review Text */}
                                                <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

                                                {/* Date and Actions */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <Calendar size={14} className="mr-1" />
                                                        Đánh giá vào: {formatDate(review.createdAt)}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/product?id=${review.productId}`)}
                                                            className="text-blue-500 hover:text-blue-700 text-xs flex items-center cursor-pointer"
                                                        >
                                                            <ExternalLink size={14} className="mr-1" />
                                                            Xem sản phẩm
                                                        </button>
                                                        <button
                                                            onClick={() => startEditReview(review)}
                                                            className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteReview(review.id)}
                                                            className="flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                                                            disabled={deletingReviewIds.includes(review.id)}
                                                        >
                                                            {deletingReviewIds.includes(review.id) ? (
                                                                <Loader className="animate-spin h-4 w-4" />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Review Modal */}
            <dialog
                id="edit-review-modal"
                className="fixed inset-0 z-50 bg-transparent p-0 m-0 h-full w-full overflow-y-auto flex items-center justify-center"
                onClick={(e) => {
                    // Đóng modal khi nhấp vào vùng bên ngoài
                    if (e.target === e.currentTarget) {
                        const modalElement = document.getElementById('edit-review-modal');
                        if (modalElement) {
                            (modalElement as any).close();
                        }
                    }
                }}
            >

                {/* Modal content */}
                <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md z-10 relative animate-fade-in-up">
                    <h3 className="text-lg font-semibold mb-4">Chỉnh sửa đánh giá</h3>

                    {editingReview && (
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-700 mb-2">Sản phẩm: {editingReview.product.productName}</p>

                                <div className="flex items-center mb-2">
                                    <p className="mr-2">Đánh giá:</p>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setEditRating(index + 1)}
                                                className="text-xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                            >
                        <span className={`${index < editRating ? "text-yellow-400" : "text-gray-300"} drop-shadow-sm transition-colors`}>
                            ★
                        </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="review-comment" className="block text-gray-700 mb-2">Nội dung đánh giá:</label>
                                <textarea
                                    id="review-comment"
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const modalElement = document.getElementById('edit-review-modal');
                                        if (modalElement) {
                                            (modalElement as any).close();
                                        }
                                    }}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={submitEditedReview}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default UserReviews;