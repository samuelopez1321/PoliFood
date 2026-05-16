import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { VendorDash } from './pages/VendorDash';
import { StorePage } from './pages/StorePage';
import { AdminPage } from './pages/AdminPage';
import { StoresPage } from './pages/StoresPage';
import { VendorMenuAdmin } from './pages/VendorMenuAdmin';
import type { Product, User } from './types'
import CartPage from "./pages/CartPage";
import LogInPage from "./pages/LogInPage";
import OrderStatus from "./pages/OrderStatus";
import { UserRole } from './types';
import { apiCreateOrder, removeToken } from './services/services';
import OrdersPage from './pages/OrdersPage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('currentUser');
      if (!saved) return null;
      return JSON.parse(saved) as User;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const saved = sessionStorage.getItem('cart');
      if (!saved) return [];
      return Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (Array.isArray(cart)) sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('cart');
    removeToken();
  };

  const handleAddToCart = (product: Product): void => {
    if (!product.isAvailable) return;
    setCart((prev) => [...prev, product]);
  };

  const handleIncreaseQuantity = (productId: string) => {
    const productToAdd = cart.find((p) => p.productId === productId);
    if (productToAdd) setCart((prev) => [...prev, productToAdd]);
  };

  const handleDecreaseQuantity = (productId: string) => {
    const indexToRemove = cart.findIndex((p) => p.productId === productId);
    if (indexToRemove !== -1) setCart((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  };

  const handleCheckout = async (): Promise<string | null> => {
    if (cart.length === 0 || !currentUser) return null;
    const storeId = cart[0].storeId;
    try {
      const resultado = await apiCreateOrder(cart, currentUser.id, storeId);
      if (resultado.success && resultado.data) {
        setCart([]);
        return resultado.data.orderId;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-neutral-50">
        {currentUser && (
          <Navbar
            User={currentUser}
            cartCount={cart?.length || 0}
            onLogout={handleLogout}
          />
        )}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {!currentUser ? (
              <>
                <Route path="/signup" element={<SignUpPage onLogin={setCurrentUser} />} />
                <Route path="/login" element={<LogInPage onLogin={setCurrentUser} />} />
                <Route path="*" element={<Navigate to="/signup" replace />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    currentUser.role === UserRole.Vendor
                      ? <VendorDash currentUser={currentUser} />
                      : (currentUser.role === UserRole.Student
                        ? <HomePage currentUser={currentUser} />
                        : <AdminPage currentUser={currentUser} />)
                  }
                />
                <Route path="/store/:storeId" element={<StorePage onAddToCart={handleAddToCart} />} />
                <Route path="/vendor/menu" element={<VendorMenuAdmin currentUser={currentUser} />} />
                {currentUser.role === UserRole.Admin && (
                  <Route path="/admin/stores" element={<StoresPage />} />
                )}
                <Route
                  path="/carrito"
                  element={
                    <CartPage
                      cart={cart}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      onRemove={handleRemoveFromCart}
                      onCheckout={handleCheckout}
                    />
                  }
                />
                <Route path="/order/:orderId" element={<OrderStatus />} />
                <Route path="/mis-pedidos" element={<OrdersPage currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
        {currentUser && <Footer />}
      </div>
    </BrowserRouter>
  )
}
export default App;
