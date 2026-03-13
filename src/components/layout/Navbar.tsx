import { useState, useRef, useEffect } from 'react';
import type { User } from '../../types';
import { STORES } from '../../data/stores';
import { Link } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';

interface NavbarProps {
  User: User | null;
  cartCount: number;
  onLogout: () => void;
}

export default function Navbar({ User, cartCount, onLogout }: NavbarProps) {
  const vendorStore = STORES.find(s => s.storeId === User?.storeId);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="bg-white border-b border-neutral-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-primary tracking-tighter cursor-pointer">
          PoliFood
        </Link>
        <nav className="flex items-center gap-8">
          
          <div className="hidden md:flex items-center gap-1">
            {/* Si es un estudiante */}
            {User?.role === 'STUDENT' && (
              <>
                  <Link 
                    to="/mis-pedidos" 
                    className="px-4 py-2 text-sm font-medium text-neutral-800 hover:text-primary transition-colors"
                  >
                    Mis Pedidos
                  </Link>
                  <Link 
                    to="/carrito" 
                    className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                    Carrito 🛒
                    {cartCount > 0 && (
                      <span className="bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white shrink-0">
                        {cartCount}
                      </span>
                    )}
                  </Link>
              </>
            )}

            {/* Si es un vendor */}
            {User?.role === 'VENDOR' && (
              <>
                <Link 
                  to="/" 
                  className="px-4 py-2 text-sm font-medium text-neutral-800 hover:text-primary transition-colors"
                >
                  Ventas y Pedidos
                </Link>
                <Link 
                  to="/vendor/menu" 
                  className="px-4 py-2 text-sm font-medium text-neutral-800 hover:text-primary transition-colors"
                >
                  Menú
                </Link>
              </>
            )}
          </div>
          {/* Sección de Usuario / Info Tienda   */}
          <div className="flex items-center gap-4 pl-6 border-l border-neutral-200" ref={menuRef}>
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-neutral-900">
                {User ? `Hola, ${User.name}` : <button className="text-primary hover:underline">Iniciar Sesión</button>}
              </span>
              
              {User?.role === 'VENDOR' && vendorStore && (
                <span className="text-[10px] uppercase tracking-widest text-neutral-800 font-bold">
                  {vendorStore.name}
                </span>
              )}
            </div>
            {User && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  {User.name.charAt(0)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-100 shadow-lg shadow-neutral-200/40 rounded-xl py-1 z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-primary transition-colors cursor-pointer"
                    >
                      <IoLogOutOutline className="text-lg" />
                      LogOut
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}