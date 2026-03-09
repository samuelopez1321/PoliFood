import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import Button  from './common/UI/Button'
import ProductList from './components/menu/ProductList'
import HomePage from './pages/HomePage';
import { VendorDash } from './pages/VendorDash';
import { StorePage } from './pages/StorePage';
import { AdminPage } from './pages/AdminPage';
import { VendorMenuAdmin } from './pages/VendorMenuAdmin';
import type { Product, User, Store } from './types'
import { PRODUCTS } from './data/products'
import { STORES } from './data/stores'
import { USERS } from './data/users'
import { ORDERS } from './data/orders';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[3]);
  const [cart, setCart] = useState<Product[]>([]);
  
  //Funcion para logica de carrito
  const handleAddToCart = (product: Product): void => {
    if (!product.available) return;
    console.log("Añadiendo:", product.name);
    setCart((prev) => [...prev, product])
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <Navbar User={currentUser} cartCount={cart.length}/>
        <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route 
                path="/"
                element={
                  currentUser?.role === 'VENDOR' 
                    ? <VendorDash currentUser={currentUser} /> 
                    : currentUser?.role === 'STUDENT'
                    ? <HomePage currentUser={currentUser} products={PRODUCTS} />
                    : <AdminPage currentUser={currentUser}/>
                } 
              />
              <Route
                path="/store/:storeId"
                element= {
                  <StorePage
                    products={PRODUCTS}
                    onAddToCart={handleAddToCart}
                  />
                }
              />
              <Route
              path="/vendor/menu"
              element={
                <VendorMenuAdmin
                currentUser={currentUser}
                />
                }
              />
            </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App