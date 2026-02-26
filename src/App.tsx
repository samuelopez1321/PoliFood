import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import { USERS } from './data/users'
import type { User } from './types'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[2]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      
      <Navbar User={currentUser} />

      {/* Contenido Principal: flex-grow hace que esta parte ocupe el espacio restante */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Aquí es donde irá tu <ProductList /> próximamente */}
        <div className="bg-white rounded-xl shadow-sm p-10 text-center border-2 border-dashed border-gray-200">
          <h2 className="text-2xl text-gray-400 font-medium">
            ¡Bienvenido a PoliFood, {currentUser?.name}!
          </h2>
          <p className="text-gray-400">Pronto verás aquí tus productos favoritos.</p>
        </div>

      </main>
      <Footer />
    </div>
  )
}

export default App