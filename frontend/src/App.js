import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";

// Pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

// Layout for customer pages
const CustomerLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <MobileNav />
  </>
);

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route
              path="/"
              element={
                <CustomerLayout>
                  <HomePage />
                </CustomerLayout>
              }
            />
            <Route
              path="/category/:category"
              element={
                <CustomerLayout>
                  <CategoryPage />
                </CustomerLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <CustomerLayout>
                  <CategoriesPage />
                </CustomerLayout>
              }
            />
            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />
            <Route
              path="/order-success"
              element={<OrderSuccessPage />}
            />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </BrowserRouter>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;
