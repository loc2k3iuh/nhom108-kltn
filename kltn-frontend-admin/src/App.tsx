import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { toast, Toaster } from "sonner";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import OtpVerification from "./pages/AuthPages/OtpVerification";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/Customers.tsx";
import FormElements from "./pages/Forms/FormElements";
import Products from "./pages/Forms/Products.tsx";
import ProductVariants from "./pages/Forms/ProductVariants.tsx";
import CategoryProductList from "./pages/Tables/CategoryProductList.tsx";
import ProductList from "./pages/Tables/ProductList.tsx";
import EditVariant from "./pages/Tables/EditVariant.tsx";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import VoucherManagement from "./pages/voucher/VoucherManagement";
import OrderList from "./pages/Orders/OrderList";
import OrderDetail from "./pages/Orders/OrderDetail";
import CreateOrder from "./pages/Orders/CreateOrder";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AccountSettings from "./pages/OtherPage/AccountSettings";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Reloading from "./components/skeletions/Reloading";
import { deleteRefreshTokenFromRedis } from "./services/useTokenService";
import Customers from "./pages/Tables/Customers.tsx";
import CategoryList from "@/pages/Tables/CategoryList.tsx";
import BrandList from "@/pages/Tables/BrandList.tsx";
import SizeList from "@/pages/Tables/SizeList.tsx";
import ColorList from "@/pages/Tables/ColorList.tsx";

export default function App() {
  const { checkAuth, authUser, isLoading, isInitialized } =
    useAuthStore();
  const {disconnectWebSocket} = useAuthStore();

  useEffect(() => {
      checkAuth();
     return () => {
       disconnectWebSocket();
     }
  }, [checkAuth]);
  console.log("authUser in App.jsx: ", authUser);

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

  return (
    <>
      <Toaster />
      <ScrollToTop />
      <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={authUser ? <Home /> : <Navigate to="/signin" />}
            />

            {/* Others Page */}
            <Route
              path="/profile"
              element={authUser ? <UserProfiles /> : <Navigate to="/signin" />}
            />
            <Route
              path="/calendar"
              element={authUser ? <Calendar /> : <Navigate to="/signin" />}
            />
            <Route
              path="/vouchers"
              element={authUser ? <VoucherManagement /> : <Navigate to="/signin" />}
            />
            <Route
              path="/orders/create"
              element={authUser ? <CreateOrder /> : <Navigate to="/signin" />}
            />
            <Route
              path="/orders/:id"
              element={authUser ? <OrderDetail /> : <Navigate to="/signin" />}
            />
            <Route
              path="/orders"
              element={authUser ? <OrderList /> : <Navigate to="/signin" />}
            />
            <Route
              path="/blank"
              element={authUser ? <Blank /> : <Navigate to="/signin" />}
            />
            <Route
              path="/account-settings"
              element={authUser ? <AccountSettings /> : <Navigate to="/signin" />}
            />

            {/* Forms */}
            <Route
              path="/form-elements"
              element={authUser ? <FormElements /> : <Navigate to="/signin" />}
            />
              <Route
                  path="/basic-tables"
                  element={authUser ? <BasicTables /> : <Navigate to="/signin" />}
              />
            <Route
                path="/forms/add-product"
                element={authUser ? <Products /> : <Navigate to="/signin" />}
            />
            <Route
                path="/forms/add-product-variant/:productId"
                element={authUser ? <ProductVariants /> : <Navigate to="/signin" />}
            />

            {/* Tables */}
            <Route
              path="/tables/category-product-list"
              element={authUser ? <CategoryProductList /> : <Navigate to="/signin" />}
            />
            <Route
                path="/tables/product-list/:id"
                element={authUser ? <ProductList /> : <Navigate to="/signin" />}
            />
            <Route
                path="/tables/customers"
                element={authUser ? <Customers /> : <Navigate to="/signin" />}
            />
            <Route
                path="/tables/edit-variant/:variantId"
                element={authUser ? <EditVariant /> : <Navigate to="/signin" />}
            />
              <Route
                  path="/tables/category-list"
                  element={authUser ? <CategoryList /> : <Navigate to="/signin" />}
              />
              <Route
                  path="/tables/brand-list"
                  element={authUser ? <BrandList /> : <Navigate to="/signin" />}
              />
              <Route
                  path="/tables/size-list"
                  element={authUser ? <SizeList /> : <Navigate to="/signin" />}
              />
              <Route
                  path="/tables/color-list"
                  element={authUser ? <ColorList /> : <Navigate to="/signin" />}
              />

            {/* Ui Elements */}
            <Route
              path="/alerts"
              element={authUser ? <Alerts /> : <Navigate to="/signin" />}
            />
            <Route
              path="/avatars"
              element={authUser ? <Avatars /> : <Navigate to="/signin" />}
            />
            <Route
              path="/badge"
              element={authUser ? <Badges /> : <Navigate to="/signin" />}
            />
            <Route
              path="/buttons"
              element={authUser ? <Buttons /> : <Navigate to="/signin" />}
            />
            <Route
              path="/images"
              element={authUser ? <Images /> : <Navigate to="/signin" />}
            />
            <Route
              path="/videos"
              element={authUser ? <Videos /> : <Navigate to="/signin" />}
            />

            {/* Charts */}
            <Route
              path="/line-chart"
              element={authUser ? <LineChart /> : <Navigate to="/signin" />}
            />
            <Route
              path="/bar-chart"
              element={authUser ? <BarChart /> : <Navigate to="/signin" />}
            />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={!authUser ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/otp-verification"
            element={!authUser ? <OtpVerification /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPassword /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password"
            element={!authUser ? <ResetPassword /> : <Navigate to="/" />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
}
