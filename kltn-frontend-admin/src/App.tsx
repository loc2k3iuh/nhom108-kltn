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
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Products from "./pages/Forms/Products.tsx";
import ProductVariants from "./pages/Forms/ProductVariants.tsx";
import CategoryProductList from "./pages/Tables/CategoryProductList.tsx";
import ProductList from "./pages/Tables/ProductList.tsx";
import EditVariant from "./pages/Tables/EditVariant.tsx";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Reloading from "./components/skeletions/Reloading";
import { deleteRefreshTokenFromRedis } from "./services/useTokenService";

export default function App() {
  const { checkAuth, authUser, isLoading } =
    useAuthStore();

  useEffect(() => {
      checkAuth();
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
  
  if (isLoading) {
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
              path="/blank"
              element={authUser ? <Blank /> : <Navigate to="/signin" />}
            />

            {/* Forms */}
            <Route
              path="/forms/form-elements"
              element={authUser ? <FormElements /> : <Navigate to="/signin" />}
            />
            <Route
                path="/forms/products"
                element={authUser ? <Products /> : <Navigate to="/signin" />}
            />
            <Route
                path="/forms/products-variants"
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
                path="/tables/basic-tables"
                element={authUser ? <BasicTables /> : <Navigate to="/signin" />}
            />
            <Route
                path="/tables/edit-variant/:variantId"
                element={authUser ? <EditVariant /> : <Navigate to="/signin" />}
            />

            {/* Ui Elements */}
            <Route
              path="/ui/alerts"
              element={authUser ? <Alerts /> : <Navigate to="/signin" />}
            />
            <Route
              path="/ui/avatars"
              element={authUser ? <Avatars /> : <Navigate to="/signin" />}
            />
            <Route
              path="/ui/badge"
              element={authUser ? <Badges /> : <Navigate to="/signin" />}
            />
            <Route
              path="/ui/buttons"
              element={authUser ? <Buttons /> : <Navigate to="/signin" />}
            />
            <Route
              path="/ui/images"
              element={authUser ? <Images /> : <Navigate to="/signin" />}
            />
            <Route
              path="/ui/videos"
              element={authUser ? <Videos /> : <Navigate to="/signin" />}
            />

            {/* Charts */}
            <Route
              path="/charts/line-chart"
              element={authUser ? <LineChart /> : <Navigate to="/signin" />}
            />
            <Route
              path="/charts/bar-chart"
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