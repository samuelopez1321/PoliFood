import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/PageFooter'
import { USERS } from './data/users' // Importamos los usuarios de prueba
import type { User } from './types' // Importamos el tipo para el estado
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(USERS[2]);


  return (
    <div className='app'>
      <Navbar User={currentUser}></Navbar>

      <Footer></Footer>
    </div>
  )
}

export default App
