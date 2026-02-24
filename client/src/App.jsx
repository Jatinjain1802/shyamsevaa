import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { WishlistProvider } from "./context/WishlistContext";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
