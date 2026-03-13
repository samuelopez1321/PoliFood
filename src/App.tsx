import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import SignUpPage from './pages/SignUpPage'; 
import HomePage from './pages/HomePage';
import { VendorDash } from './pages/VendorDash';
import { StorePage } from './pages/StorePage';
import { AdminPage } from './pages/AdminPage';
import { VendorMenuAdmin } from './pages/VendorMenuAdmin';
import type { Product, User } from './types'
import { PRODUCTS } from './data/products'
import { USERS } from './data/users'
import CartPage from "./pages/CartPage";
import LogInPage from "./pages/LogInPage";
import OrderStatus from "./pages/OrderStatus";
import { UserRole } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      if (!saved) return null;
      
      const parsed = JSON.parse(saved);
      
      // Convertir el role a enum
      const user = {
        ...parsed,
        role: parsed.role as UserRole
      } as User;
      
      return user;
      
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      return null;
    }
  });
  
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      return [];
    }
  });

  // Guardar usuario cuando cambia
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (Array.isArray(cart)) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Función de logout 
  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]); 
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart'); 
  };

  const handleAddToCart = (product: Product): void => {
    if (!product.available) return;
    setCart((prev) => [...prev, product])
  };

  const handleIncreaseQuantity = (productId: number) => {
    const productToAdd = PRODUCTS.find((p) => p.id === productId);
    if (productToAdd) setCart((prev) => [...prev, productToAdd]);
  };

  const handleDecreaseQuantity = (productId: number) => {
    const indexToRemove = cart.findIndex((p) => p.id === productId);
    if (indexToRemove !== -1) setCart((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
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
                  <Route path="/signup" element={<SignUpPage />} />
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
                        ? <HomePage currentUser={currentUser} products={PRODUCTS} />
                        : <AdminPage currentUser={currentUser}/>)
                    } 
                  />

                  <Route path="/store/:storeId" element={<StorePage products={PRODUCTS} onAddToCart={handleAddToCart} />} />
                  <Route path="/vendor/menu" element={<VendorMenuAdmin currentUser={currentUser} />} />
                  <Route 
                    path="/carrito" 
                    element={<CartPage cart={cart} onIncrease={handleIncreaseQuantity} onDecrease={handleDecreaseQuantity} onRemove={handleRemoveFromCart} onCheckout={() => console.log("Checkout")} />} 
                  />
                  <Route path="/order/:orderId" element={<OrderStatus />} />
                  <Route path="/mis-pedidos" element={<OrderStatus />} />
                  <Route path="/signup" element={<Navigate to="/" replace />} />
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