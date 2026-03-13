import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import YoutubeFeed from "./YoutubeFeed";
import AddressUpdateModal from "../common/AddressUpdateModal";
import { AuthContext } from "../../context/AuthContext";

export default function UserLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in but missing essential address info
    // Only show if not on profile/dashboard itself to avoid frustration
    if (user && user.role === 'user' && (!user.address || !user.city || !user.state)) {
      // Don't pop up immediately on login screen or simple home visit if they just landed
      // But for a realistic "first time" or "missing info" experience:
      const hasSeenModal = sessionStorage.getItem('address_modal_shown');
      if (!hasSeenModal) {
        setShowAddressModal(true);
        sessionStorage.setItem('address_modal_shown', 'true');
      }
    }
  }, [user, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1"> {/* Navbar is sticky, no margin-top needed */}
        <Outlet />
      </main>
      <YoutubeFeed />
      <Footer />

      <AddressUpdateModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </div>
  );
}
