import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/Login";
import ForgotPassword from "../pages/admin/ForgotPassword";
import VerifyOtp from "../pages/admin/VerifyOtp";
import ResetPassword from "../pages/admin/ResetPassword";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedAdmin from "./ProtectedAdmin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/verify-otp" element={<VerifyOtp />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
