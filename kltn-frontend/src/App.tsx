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
import { addToCart } from "./services/cartService";
import { AddToCartPayload } from "./types/cart";

// Auth Pages

import Authenticate from "./components/auth/Authenticate";
import RegisterPage from './pages/auth/RegisterPage';
import RegisterMailPage from './pages/auth/RegisterMailPage';
import RegisterSuccessPage from './pages/auth/RegisterSuccessPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ForgotPasswordSuccessPage from './pages/auth/ForgotPasswordSuccessPage';
import ChangeForgotPasswordPage from './pages/auth/ChangeForgotPasswordPage';

// Main Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SearchResultPage from './pages/SearchResultPage';

// User Pages
import UserPage from './pages/UserPage';
import EditUser from './pages/EditUser';
import ChangePassword from './pages/auth/ChangePassword';
import AddressesPage from './pages/AddressesPage';
import NewAddress from './pages/NewAddress';
import EditAddress from './pages/EditAddress';
import NotAuthenticatedPage from './pages/NotAuthenticatedPage';

// Product & Category Pages
import ProductListPage from './pages/categories/CategoryProductList';
import Product from './pages/product/Product';

// Shopping Pages
import Cart from './pages/cart/Cart';
import OrderList from './pages/cart/OrderList';
import FavoritesPage from './pages/favorite/Favorite';
import VoucherPage from './pages/voucher/Voucher';

// Payment Pages
import Payment from './pages/payment/payment';
import VnpayReturn from './pages/payment/VnpayReturn';
import OrderSuccess from './pages/payment/OrderSuccess';

// Review Pages
import UserReviews from './pages/review/Review';

// Info Pages
import AboutPage from './pages/AboutPage';
import FAQ from './pages/FAQ';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ShippingPolicy from './pages/ShippingPolicy';
import Layout from "./components/Layout";
import NotAuthenticated from "./pages/NotAuthenticatedPage";
import LoginPage from "./pages/auth/LoginPage";

export default function App() {
  const { checkAuth, authUser, isLoading, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const prevAuthUser = useRef(authUser);
  const hasSynced = useRef(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
    console.log("authUser in App.jsx: ", authUser);

  useEffect(() => {
    const handleLoginSync = async () => {
      // Check if user has just logged in and sync has not happened yet
      if (authUser && !prevAuthUser.current && !hasSynced.current) {
        hasSynced.current = true; // Set the flag immediately to prevent re-entry

        const localCartData = localStorage.getItem('cart');
        const buyNowItemData = localStorage.getItem('buyNowItem');

        if (localCartData || buyNowItemData) {
            const toastId = toast.loading("Đang đồng bộ giỏ hàng của bạn...");

            const syncTasks: Promise<any>[] = [];
            let shouldNavigateToCart = false;

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

            await Promise.allSettled(syncTasks).then(results => {
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
      }
      // Update previous auth user state for the next render
      prevAuthUser.current = authUser;

      // Reset sync flag if user logs out
      if (!authUser) {
        hasSynced.current = false;
      }
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


  if (isLoading || !isInitialized) {
    return <Reloading />;
  }

  if(authUser && !authUser.is_active){
    return <NotAuthenticated/>
  }

  return (
      <>
          <Toaster />
          <ScrollToTop />
   
      <Routes>
        {/* Main Fashion E-commerce Layout */}
    
          {/* Home Page */}
          <Route index path="/" element={<Layout><Home /></Layout>} />
          
          {/* Product & Category Pages */}
          <Route path="/products" element={<Layout><ProductListPage /></Layout>} />
          <Route path="/category/:categoryId" element={<Layout><ProductListPage /></Layout>} />
          <Route path="/product/:id" element={<Layout><Product /></Layout>} />
          <Route path="/search/products" element={<Layout><SearchResultPage /></Layout>} />

          {/* User Profile Pages - Require Authentication */}
          <Route path="/profile" element={authUser ? <Layout> <UserPage /> </Layout>: <Navigate to="/signin" />} />
       
          <Route path="/user/edit" element={authUser ? <Layout><EditUser /></Layout> : <Navigate to="/signin" />} />
          <Route path="/change-password" element={authUser ? <Layout>  <ChangePassword />  </Layout> : <Navigate to="/signin" />} />
          
          {/* Address Management */}
          <Route path="/user/addresses" element={authUser ? <Layout><AddressesPage /></Layout> : <Navigate to="/signin" />} />
          <Route path="/user/addresses/new" element={authUser ? <Layout><NewAddress /></Layout> : <Navigate to="/signin" />} />
          <Route path="/user/addresses/edit/:id" element={authUser ? <Layout><EditAddress /></Layout> : <Navigate to="/signin" />} />

          {/* Shopping Pages */}  
          <Route path="/cart" element={ <Layout><Cart /></Layout>} />
          <Route path="/orders" element={authUser ? <Layout><OrderList /></Layout> : <Navigate to="/signin" />} />
           <Route path="/order-success" element={authUser ? <Layout><OrderSuccess /></Layout> : <Navigate to="/signin" />} />
          <Route path="/favorites" element={authUser ? <Layout><FavoritesPage /></Layout> : <Navigate to="/signin" />} />
          <Route path="/reviews" element={authUser ? <Layout><UserReviews /></Layout> : <Navigate to="/signin" />} />
          <Route path="/voucher" element={authUser ? <Layout><VoucherPage /></Layout> : <Navigate to="/signin" />} />

          {/* Payment Pages */}
          <Route path="/payment" element={authUser ? <Layout> <Payment /> </Layout> : <Navigate to="/signin" />} />
          <Route path="/payment/vnpay-return" element={<Layout> <VnpayReturn /> </Layout>} />
          <Route path="/payment/success" element={<Layout> <OrderSuccess /> </Layout>} />


          {/* Review Pages */}
          <Route path="/user/reviews" element={authUser ? <Layout><UserReviews /></Layout> : <Navigate to="/signin" />} />


          {/* Information Pages */}
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/shipping-policy" element={<Layout><ShippingPolicy /></Layout>} />
          
    

        {/* Authentication Pages - No Layout */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/register-mail" element={!authUser ? <RegisterMailPage /> : <Navigate to="/" />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
        <Route path="/authenticate" element={<Authenticate/>}/>
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password-success" element={<ForgotPasswordSuccessPage />} />
        <Route path="/change-forgot-password" element={<ChangeForgotPasswordPage />} />
        <Route path="/not-authenticated" element={<NotAuthenticatedPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>

</>
  );
}
