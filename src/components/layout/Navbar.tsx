import type { User } from '../../types';
import { STORES } from '../../data/stores';

interface NavbarProps {
  User: User | null;
}

export default function Navbar({ User }: NavbarProps) {
  const vendorStore = STORES.find(s => s.storeId === User?.storeId);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
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
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  Mis Pedidos
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                  Carrito 🛒
                </button>
              </>
            )}

            {/* Si es un vendor */}
            {User?.role === 'VENDOR' && (
              <>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  Ventas y Pedidos
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  Menú
                </button>
              </>
            )}

            {/* Si es un admin */}
            {User?.role === 'ADMIN' && (
              <button className="px-4 py-2 text-sm font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                Gestionar Vendors
              </button>
            )}
          </div>

          {/* Sección de Usuario / Info Tienda */}
          <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-gray-800">
                {User ? `Hola, ${User.name}` : <button className="text-primary hover:underline">Iniciar Sesión</button>}
              </span>
              
              {User?.role === 'VENDOR' && vendorStore && (
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  {vendorStore.name}
                </span>
              )}
            </div>
            
            {/* Avatar Placeholder */}
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