import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Reloading from "./components/skeletions/Reloading";
import { deleteRefreshTokenFromRedis } from "./services/useTokenService";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import { addToCart } from "./services/cartService";
import { AddToCartPayload } from "./types/cart";

// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import OtpVerification from "./pages/AuthPages/OtpVerification";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import LoginPage from './pages/OtherPages/LoginPage.tsx';
import RegisterPage from './pages/OtherPages/RegisterPage.tsx';
import RegisterMailPage from './pages/OtherPages/RegisterMailPage.tsx';
import RegisterSuccessPage from './pages/OtherPages/RegisterSuccessPage.tsx';
import ForgotPasswordPage from './pages/OtherPages/ForgotPasswordPage.tsx';
import ForgotPasswordSuccessPage from './pages/OtherPages/ForgotPasswordSuccessPage.tsx';
import ChangeForgotPasswordPage from './pages/OtherPages/ChangeForgotPasswordPage.tsx';

// Main Pages
import Home from './pages/OtherPages/Home.tsx';
import NotFound from './pages/OtherPages/NotFound.tsx';
import SearchPage from './pages/OtherPages/SearchPage.tsx';

// User Pages
import UserPage from './pages/OtherPages/UserPage.tsx';
import UserProfiles from "./pages/OtherPages/UserProfiles.tsx";
import EditUser from './pages/OtherPages/EditUser.tsx';
import ChangePassword from './pages/OtherPages/ChangePassword.tsx';
import AddressesPage from './pages/OtherPages/AddressesPage.tsx';
import NewAddress from './pages/OtherPages/NewAddress.tsx';
import EditAddress from './pages/OtherPages/EditAddress.tsx';
import NotAuthenticatedPage from './pages/OtherPages/NotAuthenticatedPage.tsx';

// Product & Category Pages
import ProductListPage from '@/pages/Categories/CategoryProductList';
import Product from '@/pages/Product/Product';

// Shopping Pages
import Cart from '@/pages/Cart/Cart';
import OrderList from '@/pages/Cart/OrderList';
import FavoritesPage from '@/pages/Favorite/Favorite';
import VoucherPage from '@/pages/Voucher/Voucher';

// Payment Pages
import Payment from '@/pages/Payment/payment';
import VnpayReturn from '@/pages/Payment/VnpayReturn';
import OrderSuccess from '@/pages/Payment/OrderSuccess';

// Review Pages
import UserReviews from '@/pages/Review/Review';

// Info Pages
import AboutPage from './pages/OtherPages/AboutPage.tsx';
import FAQ from './pages/OtherPages/FAQ.tsx';
import Help from './pages/OtherPages/Help.tsx';
import PrivacyPolicy from './pages/OtherPages/PrivacyPolicy.tsx';
import TermsOfService from './pages/OtherPages/TermsOfService.tsx';
import ShippingPolicy from './pages/OtherPages/ShippingPolicy.tsx';

export default function App() {
  const { checkAuth, authUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const prevAuthUser = useRef(authUser);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
    console.log("authUser in App.jsx: ", authUser);


    useEffect(() => {
    const handleLoginSync = async () => {
      // Check if user has just logged in
      if (authUser && !prevAuthUser.current) {
        const localCartData = localStorage.getItem('cart');
        const buyNowItemData = localStorage.getItem('buyNowItem');

        let syncPromise = Promise.resolve();
        let shouldNavigateToCart = false;

        if (localCartData || buyNowItemData) {
            const toastId = toast.loading("Đang đồng bộ giỏ hàng của bạn...");

            const syncTasks: Promise<any>[] = [];

            // Sync local cart
            if (localCartData) {
                try {
                    const localCartItems: any[] = JSON.parse(localCartData);
                    localCartItems.forEach(item => {
                        const payload: AddToCartPayload = {
                            userId: authUser.id,
                            productId: item.productId,
                            productVariantId: item.productVariantId,
                            quantity: item.quantity,
                        };
                        syncTasks.push(addToCart(payload));
                    });
                } catch (error) {
                    console.error("Error parsing local cart data:", error);
                }
            }

            // Sync buy now item
            if (buyNowItemData) {
                try {
                    const buyNowItem = JSON.parse(buyNowItemData);
                    const payload: AddToCartPayload = {
                        userId: authUser.id,
                        productId: buyNowItem.productId,
                        productVariantId: buyNowItem.productVariantId,
                        quantity: buyNowItem.quantity,
                    };
                    syncTasks.push(addToCart(payload));
                    shouldNavigateToCart = true; // Navigate to cart after handling buy now
                } catch (error) {
                    console.error("Error parsing buy now item data:", error);
                }
            }

            syncPromise = Promise.allSettled(syncTasks).then(results => {
                const failedTasks = results.filter(r => r.status === 'rejected');
                if (failedTasks.length > 0) {
                    toast.error(`Có lỗi xảy ra khi đồng bộ ${failedTasks.length} sản phẩm. Vui lòng kiểm tra lại giỏ hàng.`, { id: toastId });
                } else {
                    toast.success("Đồng bộ giỏ hàng thành công!", { id: toastId });
                }

                // Clean up local storage
                localStorage.removeItem('cart');
                localStorage.removeItem('buyNowItem');

                if (shouldNavigateToCart) {
                    navigate('/cart');
                }
            });
        }

        await syncPromise;
      }
      // Update previous auth user state
      prevAuthUser.current = authUser;
    };

    handleLoginSync();
  }, [authUser, navigate]);

  useEffect(() => {
    const handleUnload = async () => {
        await deleteRefreshTokenFromRedis();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, []);
  
  if (isLoading) {
    return <Reloading />;
  }

  return (
    <>
      <Toaster />
      <ScrollToTop />
      <Routes>
        {/* Main Fashion E-commerce Layout */}
        <Route element={<AppLayout />}>
          {/* Home Page */}
          <Route index path="/" element={<Home />} />
          
          {/* Product & Category Pages */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/category/:categoryId" element={<ProductListPage />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/search" element={<SearchPage />} />

          {/* User Profile Pages - Require Authentication */}
          <Route path="/user" element={authUser ? <UserPage /> : <Navigate to="/signin" />} />
          <Route path="/user/profile" element={authUser ? <UserProfiles /> : <Navigate to="/signin" />} />
          <Route path="/user/edit" element={authUser ? <EditUser /> : <Navigate to="/signin" />} />
          <Route path="/user/change-password" element={authUser ? <ChangePassword /> : <Navigate to="/signin" />} />
          
          {/* Address Management */}
          <Route path="/user/addresses" element={authUser ? <AddressesPage /> : <Navigate to="/signin" />} />
          <Route path="/user/addresses/new" element={authUser ? <NewAddress /> : <Navigate to="/signin" />} />
          <Route path="/user/addresses/edit/:id" element={authUser ? <EditAddress /> : <Navigate to="/signin" />} />

          {/* Shopping Pages */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={authUser ? <OrderList /> : <Navigate to="/signin" />} />
          <Route path="/favorites" element={authUser ? <FavoritesPage /> : <Navigate to="/signin" />} />
          <Route path="/voucher" element={authUser ? <VoucherPage /> : <Navigate to="/signin" />} />

          {/* Payment Pages */}
          <Route path="/payment" element={authUser ? <Payment /> : <Navigate to="/signin" />} />
          <Route path="/payment/vnpay-return" element={<VnpayReturn />} />
          <Route path="/payment/success" element={<OrderSuccess />} />

          {/* Review Pages */}
          <Route path="/reviews" element={authUser ? <UserReviews /> : <Navigate to="/signin" />} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          
        </Route>

        {/* Authentication Pages - No Layout */}
        <Route path="/signin" element={!authUser ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/register-mail" element={!authUser ? <RegisterMailPage /> : <Navigate to="/" />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
        <Route path="/otp-verification" element={!authUser ? <OtpVerification /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/forgot-password-page" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password-success" element={<ForgotPasswordSuccessPage />} />
        <Route path="/reset-password" element={!authUser ? <ResetPassword /> : <Navigate to="/" />} />
        <Route path="/change-forgot-password" element={<ChangeForgotPasswordPage />} />
        <Route path="/not-authenticated" element={<NotAuthenticatedPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
