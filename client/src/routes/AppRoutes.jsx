import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedAdmin from "./ProtectedAdmin";
import ProtectedRoute from "./ProtectedRoute";

// Lazy loading page components for better performance
const Home = lazy(() => import("../pages/Home"));
const Templess = lazy(() => import("../pages/users/Temples"));
const ForgotPassword = lazy(() => import("../pages/admin/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/admin/VerifyOtp"));
const ResetPassword = lazy(() => import("../pages/admin/ResetPassword"));
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Bookings = lazy(() => import("../pages/admin/Bookings"));
const Users = lazy(() => import("../pages/admin/Users"));
const Poojas = lazy(() => import("../pages/admin/Poojas"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const Temples = lazy(() => import("../pages/admin/Temples"));
const Chadawas = lazy(() => import("../pages/admin/Chadawas"));
const ChadawaItems = lazy(() => import("../pages/admin/ChadawaItems"));
const ChadawaBenefits = lazy(() => import("../pages/admin/ChadawaBenefits"));
const TempleDetail = lazy(() => import("../pages/users/TempleDetail"));
const Addons = lazy(() => import("../pages/admin/Addons"));
const Poojass = lazy(() => import("../pages/users/Poojas"));
const Chadawass = lazy(() => import("../pages/users/Chadawas"));
const Gallery = lazy(() => import("../pages/users/Gallery"));
const About = lazy(() => import("../pages/users/About"));
const PoojaDetail = lazy(() => import("../pages/users/PoojaDetail"));
const ChadawaDetail = lazy(() => import("../pages/users/ChadawaDetail"));
const TempleChadawas = lazy(() => import("../pages/users/TempleChadawas"));
const Muhurat = lazy(() => import("../pages/users/Muhurat"));
const BookingCheckout = lazy(() => import("../pages/users/BookingCheckout"));
const SearchResults = lazy(() => import("../pages/users/SearchResults"));
const Wishlist = lazy(() => import("../pages/users/Wishlist"));
const Login = lazy(() => import("../pages/users/Login"));
const Signup = lazy(() => import("../pages/users/Signup"));
const UserDashboard = lazy(() => import("../pages/users/UserDashboard"));
const Panchang = lazy(() => import("../pages/users/Panchang"));
const PrivacyPolicy = lazy(() => import("../pages/users/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../pages/users/TermsAndConditions"));
const RefundPolicy = lazy(() => import("../pages/users/RefundPolicy"));
const Contact = lazy(() => import("../pages/users/Contact"));
const UserProducts = lazy(() => import("../pages/users/Products"));
const ProductDetail = lazy(() => import("../pages/users/ProductDetail"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const YoutubeLinks = lazy(() => import("../pages/admin/YoutubeLinks"));

// Fallback Spinner for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* User Interface Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="/temples" element={<Templess />} />
            <Route path="/temples/:slug" element={<TempleDetail />} />
            <Route path="/poojas" element={<Poojass />} />
            <Route path="/poojas/:slug" element={<PoojaDetail />} />
            <Route 
              path="/booking-checkout" 
              element={
                <ProtectedRoute>
                  <BookingCheckout />
                </ProtectedRoute>
              } 
            />
            <Route path="/chadawas" element={<Chadawass />} />
            <Route path="/chadawas/:slug" element={<ChadawaDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<UserProducts />} />
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

          {/* Dedicated Dashboard Route */}
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
            <Route path="products" element={<AdminProducts />} />
            <Route path="chadawas/:chadawaId/items" element={<ChadawaItems />} />
            <Route path="chadawas/:chadawaId/benefits" element={<ChadawaBenefits />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="youtube-links" element={<YoutubeLinks />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
