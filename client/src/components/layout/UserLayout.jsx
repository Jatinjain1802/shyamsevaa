import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1"> {/* Navbar is sticky, no margin-top needed */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
