import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../pages/Home";
import AdminLogin from "../pages/admin/Login";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* User Interface Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="/temples" element={<Templess />} />
        <Route path="/temples/:id" element={<TempleDetail />} />
        <Route path="/poojas" element={<Poojass />} />
        <Route path="/poojas/:poojaId" element={<PoojaDetail />} />
        <Route path="/chadawas" element={<Chadawass />} />
        <Route path="/chadawas/:chadawaId" element={<ChadawaDetail />} />
        <Route path="/temples/:id/chadawas" element={<TempleChadawas />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/muhurat" element={<Muhurat />} />
      </Route>

      {/* Admin Login Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/verify-otp" element={<VerifyOtp />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
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
      </Route>
    </Routes>
  );
}
