import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import Button  from './common/UI/Button'
import { USERS } from './data/users'
import type { User } from './types'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[0]);

  return (
    /* bg-neutral-50: Usamos el fondo más claro de tu paleta neutral */
    <div className="flex flex-col min-h-screen bg-neutral-50">
      
      <Navbar User={currentUser} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-dashed border-primary-light/30">
          <h2 className="text-3xl text-neutral-900 font-bold mb-2">
            ¡Bienvenido a <span className="text-primary">PoliFood</span>, {currentUser?.name}!
          </h2>
          <p className="text-neutral-800">
            Explora el menú y descubre tus productos favoritos de hoy.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App