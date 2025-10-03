import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import OtpVerification from "./pages/AuthPages/OtpVerification";
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
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Reloading from "./components/skeletions/Reloading";

export default function App() {
  const { checkAuth, authUser, isCheckingAuth, isSigningOut, isUpdating } = useAuthStore();
 
  useEffect(() => {
     checkAuth();
  }, [checkAuth]);

    console.log("authUser in App.jsx: ", authUser);

  if (isCheckingAuth || isSigningOut || isUpdating) {
    return <Reloading />;
  }

  return (
    <>
      <Toaster />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={authUser ? <Home /> : <Navigate to="/signin"/>} />

            {/* Others Page */}
            <Route path="/profile" element={authUser ? <UserProfiles/> : <Navigate to="/signin"/>} />
            <Route path="/calendar" element={authUser ?  <Calendar /> : <Navigate to="/signin"/>} />
            <Route path="/blank" element={authUser ?  <Blank /> : <Navigate to="/signin"/>} />

            {/* Forms */}
            <Route path="/form-elements" element={authUser ?  <FormElements /> : <Navigate to="/signin"/>} />

            {/* Tables */}
            <Route path="/basic-tables" element={authUser ?  <BasicTables /> : <Navigate to="/signin"/>} />

            {/* Ui Elements */}
            <Route path="/alerts" element={authUser ? <Alerts /> : <Navigate to="/signin"/>} />
            <Route path="/avatars" element={authUser ? <Avatars /> : <Navigate to="/signin"/>} />
            <Route path="/badge" element={authUser ? <Badges /> : <Navigate to="/signin"/>} />
            <Route path="/buttons" element={authUser ? <Buttons /> : <Navigate to="/signin"/>} />
            <Route path="/images" element={authUser ? <Images /> : <Navigate to="/signin"/>} />
            <Route path="/videos" element={authUser ? <Videos />  : <Navigate to="/signin"/>} />

            {/* Charts */}
            <Route path="/line-chart" element={authUser ? <LineChart /> : <Navigate to="/signin"/>} />
            <Route path="/bar-chart" element={authUser ? <BarChart /> : <Navigate to="/signin"/>} />
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

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
