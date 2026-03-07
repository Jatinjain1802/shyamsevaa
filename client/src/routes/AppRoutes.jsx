import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../pages/Home";
import Templess from "../pages/users/Temples";
import ForgotPassword from "../pages/admin/ForgotPassword";
import VerifyOtp from "../pages/admin/VerifyOtp";
import ResetPassword from "../pages/admin/ResetPassword";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Bookings from "../pages/admin/Bookings";
import Services from "../pages/admin/Services";
import Pandits from "../pages/admin/Pandits";
import Users from "../pages/admin/Users";
import ProtectedAdmin from "./ProtectedAdmin";
import Poojas from "../pages/admin/Poojas";
import Orders from "../pages/admin/Orders";
import Temples from "../pages/admin/Temples";
import Chadawas from "../pages/admin/Chadawas";
import ChadawaItems from "../pages/admin/ChadawaItems";
import ChadawaBenefits from "../pages/admin/ChadawaBenefits";
import TempleDetail from "../pages/users/TempleDetail";
import Addons from "../pages/admin/Addons";
import Poojass from "../pages/users/Poojas";
import Chadawass from "../pages/users/Chadawas";
import Gallery from "../pages/users/Gallery";
import About from "../pages/users/About";
import PoojaDetail from "../pages/users/PoojaDetail";
import ChadawaDetail from "../pages/users/ChadawaDetail";
import TempleChadawas from "../pages/users/TempleChadawas";
import Muhurat from "../pages/users/Muhurat";
import BookingCheckout from "../pages/users/BookingCheckout";
import SearchResults from "../pages/users/SearchResults";
import Wishlist from "../pages/users/Wishlist";
import ScrollToTop from "../components/ScrollToTop";
import Login from "../pages/users/Login";
import Signup from "../pages/users/Signup";
import UserDashboard from "../pages/users/UserDashboard";
import Panchang from "../pages/users/Panchang";
import PrivacyPolicy from "../pages/users/PrivacyPolicy";
import TermsAndConditions from "../pages/users/TermsAndConditions";
import RefundPolicy from "../pages/users/RefundPolicy";
import Contact from "../pages/users/Contact";


export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* User Interface Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/temples" element={<Templess />} />
          {/* LEARNING: Using :slug parameter for SEO-friendly URLs */}
          <Route path="/temples/:slug" element={<TempleDetail />} />
          <Route path="/poojas" element={<Poojass />} />
          <Route path="/poojas/:slug" element={<PoojaDetail />} />
          <Route path="/booking-checkout" element={<BookingCheckout />} />
          <Route path="/chadawas" element={<Chadawass />} />
          <Route path="/chadawas/:slug" element={<ChadawaDetail />} />
          <Route path="/temples/:slug/chadawas" element={<TempleChadawas />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/muhurat" element={<Muhurat />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/panchang" element={<Panchang />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} />

        </Route>

        {/* Dedicated Dashboard Route with custom layout logic */}
        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Auth Flow Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="poojas" element={<Poojas />} />
          <Route path="addons" element={<Addons />} />
          <Route path="temples" element={<Temples />} />

          <Route path="chadawas" element={<Chadawas />} />
          <Route path="chadawas/:chadawaId/items" element={<ChadawaItems />} />
          <Route path="chadawas/:chadawaId/benefits" element={<ChadawaBenefits />} />

          <Route path="pandits" element={<Pandits />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </>
  );
}

