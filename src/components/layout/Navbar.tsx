import { useState } from 'react';
import type { User } from '../../types';
import { STORES } from '../../data/stores';
import { Link } from 'react-router-dom';
import { IoLogOutOutline, IoCartOutline } from 'react-icons/io5';

interface NavbarProps {
  User: User | null;
  cartCount: number;
  onLogout: () => void;
}

export default function Navbar({ User, cartCount, onLogout }: NavbarProps) {
  const vendorStore = STORES.find(s => s.storeId === User?.storeId);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:h-16 md:py-0 gap-3">
          <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
            PoliFood
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Enlaces se ocultan en móvil para no mostrar muchas cosas */}
            <nav className="sm:flex items-center gap-2">
              {User?.role === 'STUDENT' && (
                <>
                  <Link to="/mis-pedidos" className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-primary transition-colors">
                    PEDIDOS
                  </Link>
                  <Link to="/carrito" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-xs font-black shadow-lg shadow-primary/20">
                    <IoCartOutline className="text-sm" />
                    {cartCount}
                  </Link>
                </>
              )}

              {User?.role === 'VENDOR' && (
                <>
                  <Link to="/" className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-primary">VENTAS</Link>
                  <Link to="/vendor/menu" className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-primary">MENÚ</Link>
                </>
              )}
            </nav>
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <div className="flex flex-col text-right leading-none">
                <span className="text-sm font-black text-neutral-800">
                  {User ? User.name.split(' ')[0] : null }
                </span>
                {User?.role === 'VENDOR' && vendorStore && (
                  <span className="text-[9px] uppercase font-black text-primary tracking-widest mt-0.5">
                    {vendorStore.name}
                  </span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm hover:scale-105 transition-transform"
                >
                  {User?.name.charAt(0)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-neutral-100 shadow-xl rounded-2xl overflow-hidden py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs font-bold text-accent hover:bg-accent/5"
                    >
                      <IoLogOutOutline /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}