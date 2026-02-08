import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { WishlistProvider } from "./context/WishlistContext";

export default function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <AppRoutes />
      </WishlistProvider>
    </BrowserRouter>
  );
}
