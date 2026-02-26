import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { WishlistProvider } from "./context/WishlistContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <WishlistProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </WishlistProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
