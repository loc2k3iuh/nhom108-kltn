import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Import all page components
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import NewAddress from "./pages/NewAddress";
import Category from "./pages/categories/Category";
import SearchPage from "./pages/SearchPage";
import Cart from "./pages/cart/Cart";
import Product from "./pages/product/Product";
import NotFound from "./pages/NotFound";
import RegisterMailPage from "./pages/auth/RegisterMailPage";
import NotAuthenticated from "./pages/NotAuthenticatedPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterSuccessPage from "./pages/auth/RegisterSuccessPage";
import ChangePassword from "./pages/auth/ChangePassword";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ForgotPasswordSuccessPage from "./pages/auth/ForgotPasswordSuccessPage";
import ChangeForgotPasswordPage from "./pages/auth/ChangeForgotPasswordPage";
import VnpayReturn from "./pages/payment/VnpayReturn";
import AddressesPage from "./pages/AddressesPage";
import EditAddress from "./pages/EditAddress";
import AboutPage from "./pages/AboutPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import CategoryWithSupplier from "./pages/categories/CategoryWithSupplier";
import OrderList from "./pages/cart/OrderList";
import VoucherPage from "./pages/voucher/Voucher";
import Payment from "./pages/payment/payment";
import FavoritesPage from "./pages/favorite/Favorite";
import UserReviews from "./pages/review/Review";
import OrderSuccess from "./pages/payment/OrderSuccess";
import { useAuthStore } from "./stores/useAuthStore";
import Reloading from "./components/skeletons/Reloading";

function App() {
  const { checkAuth, authUser, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if(!isLoading){
      <Reloading/>
    }

  return (
    <Router>
      <Routes>
        {/* Home and About Pages */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <Layout>
              <TermsOfService />
            </Layout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/shipping-policy"
          element={
            <Layout>
              <ShippingPolicy />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/help"
          element={
            <Layout>
              <Help />
            </Layout>
          }
        />

        {/* Authentication Pages */}
        <Route
          path="/user/forgot-password/success"
          element={<ForgotPasswordSuccessPage />}
        />
        <Route
          path="/user/forgot-password/change"
          element={<ChangeForgotPasswordPage />}
        />
        <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />
        <Route path="/register-mail" element={<RegisterMailPage />} />
        <Route
          path="/register-success"
          element={<RegisterSuccessPage />}
        />

        {/* Search and Categories */}
        <Route
          path="/search"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />
        <Route
          path="/search/:term"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />
        <Route
          path="/category"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />
        <Route
          path="/category/:categoryId/supplier/:supplierId"
          element={
            <Layout>
              <CategoryWithSupplier />
            </Layout>
          }
        />

        {/* Shopping */}
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />

        {/* Payment */}
        <Route path="/payment/vnpay-return" element={<VnpayReturn />} />
        <Route
          path="/payment"
          element={
            <Layout>
              <Payment />
            </Layout>
          }
        />
        <Route
          path="/order-success"
          element={
            <Layout>
              <OrderSuccess />
            </Layout>
          }
        />

        {/* User Management */}
        <Route
          path="/user/orders"
          element={
            <Layout>
              <OrderList />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <UserPage />
            </Layout>
          }
        />
        <Route
          path="/user/addresses"
          element={
            <Layout>
              <AddressesPage />
            </Layout>
          }
        />
        <Route
          path="/user/addresses/new"
          element={
            <Layout>
              <NewAddress />
            </Layout>
          }
        />
        <Route
          path="/user/addresses/:addressId/edit"
          element={
            <Layout>
              <EditAddress />
            </Layout>
          }
        />
        <Route
          path="/user/change-password"
          element={
            <Layout>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="/user/wishlist"
          element={
            <Layout>
              <FavoritesPage />
            </Layout>
          }
        />
        <Route
          path="/user/reviews"
          element={
            <Layout>
              <UserReviews />
            </Layout>
          }
        />

        {/* Vouchers */}
        <Route
          path="/voucher"
          element={
            <Layout>
              <VoucherPage />
            </Layout>
          }
        />
        <Route
          path="/ma-giam-gia"
          element={
            <Layout>
              <VoucherPage />
            </Layout>
          }
        />

        {/* Error Pages */}
        <Route path="/unauthenticated" element={<NotAuthenticated />} />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
