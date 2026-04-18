// client/src/App.tsx with advanced features
import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/Home"));
const Shop = React.lazy(() => import("@/pages/Shop"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const About = React.lazy(() => import("@/pages/About"));
const AdminProducts = React.lazy(() => import("@/pages/AdminProducts"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin/products"
            element={
              <AuthProvider>
                <AdminProducts />
              </AuthProvider>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  // Preload critical fonts and assets
  useEffect(() => {
    // Preload Google Fonts or other critical assets
    if ("fonts" in document) {
      document.fonts?.ready.catch((error) => console.error("Error:", error));
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <CartProvider>
                <Suspense fallback={<LoadingScreen />}>
                  <AnimatedRoutes />
                </Suspense>
              </CartProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
