import type { User } from '../../types';
import { STORES } from '../../data/stores';
import { Link } from 'react-router-dom';

interface NavbarProps {
  User: User | null;
  cartCount: number;
}

export default function Navbar({ User, cartCount }: NavbarProps) {
  const vendorStore = STORES.find(s => s.storeId === User?.storeId);

  return (
    <header className="bg-white border-b border-neutral-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Titulo / Logo */}
        <h2 className="text-2xl font-black text-primary tracking-tighter cursor-pointer">
          PoliFood
        </h2>

        {/* Navegación Principal */}
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

            {/* Si es un admin */}
            {User?.role === 'ADMIN' && (
              <Link 
                to="/admin/vendors" 
                className="px-4 py-2 text-sm font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                Gestionar Vendors
              </Link>
            )}
          </div>

          {/* Sección de Usuario / Info Tienda */}
          <div className="flex items-center gap-4 pl-6 border-l border-neutral-200">
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
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {User.name.charAt(0)}
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}