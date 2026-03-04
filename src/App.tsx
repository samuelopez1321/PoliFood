import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import Button  from './common/UI/Button'
import { USERS } from './data/users'
import ProductList from './components/menu/ProductList'
import type { Product, User } from './types'
import { PRODUCTS } from './data/products'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[2]);
  const [cart, setCart] = useState<Product[]>([]);

  //Funcion para logica de carrito
  const handleAddToCart = (product: Product) => {
    if (!product.available) return;
    console.log("Añadiendo:", product.name);
    setCart((prev) => [...prev, product])
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      
      <Navbar User={currentUser} cartCount={cart.length}/>

      <main className="flex-grow container mx-auto px-4 py-8">
          {/* Caso 1: El usuario es un ESTUDIANTE */}
          {currentUser?.role === 'STUDENT' && (
            <>
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-neutral-100 mb-8">
                <h2 className="text-2xl text-neutral-900 font-bold">
                  ¡Qué bueno verte, <span className="text-primary">{currentUser?.name}</span>!
                </h2>
                <p className="text-neutral-800">Explora el menú y descubre tus productos favoritos de hoy.</p>
              </div>

              <ProductList 
                products={PRODUCTS} 
                onAddToCart={handleAddToCart} 
                storeName="Campus Burger" 
              />
            </>
          )}

          {/* Caso 2: El usuario es un VENDEDOR */}
          {currentUser?.role === 'VENDOR' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-neutral-900">Panel de Vendedor</h2>
              <p className="text-neutral-800">Aquí gestionarás tus pedidos en tiempo real.</p>
              {/* Aquí irá el VendorDashboard más adelante */}
            </div>
          )}

          {/* Caso 3: No hay usuario (por si acaso) */}
          {!currentUser && (
            <div className="text-center py-20">
              <p className="text-neutral-800 text-lg">Por favor, inicia sesión para ver el menú.</p>
            </div>
          )}

      </main>
      <Footer />
    </div>
  )
}

export default App