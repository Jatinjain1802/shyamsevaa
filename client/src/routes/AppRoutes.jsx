import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../pages/Home";
import AdminLogin from "../pages/admin/Login";
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
import PoojaAddons from "../pages/admin/PoojaAddons";
import Temples from "../pages/admin/Temples";
import Chadawas from "../pages/admin/Chadawas";
import ChadawaItems from "../pages/admin/ChadawaItems";

export default function AppRoutes() {
  return (
    <Routes>
      {/* User Interface Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
      </Route>

{/* Admin Login Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/verify-otp" element={<VerifyOtp />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
{/* Admin Dashboard Routes */}
      {/* <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="services" element={<Services />} />
        <Route path="pandits" element={<Pandits />} />
        <Route path="users" element={<Users />} />
      </Route> */}
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
  <Route path="pooja-addons" element={<PoojaAddons />} />
  <Route path="temples" element={<Temples />} />

  <Route path="chadawas" element={<Chadawas />} />
  <Route path="chadawa-items" element={<ChadawaItems />} />

  <Route path="pandits" element={<Pandits />} />
  <Route path="bookings" element={<Bookings />} />
  <Route path="users" element={<Users />} />
</Route>
    </Routes>
  );
}
