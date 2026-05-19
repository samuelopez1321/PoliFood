import { useState, useEffect } from 'react';
import type { User, Store } from '../../types';
import { Link } from 'react-router-dom';
import { IoLogOutOutline, IoCartOutline, IoPersonOutline } from 'react-icons/io5';
import { apiGetStoreById, apiDeactivateStore } from '../../services/services';

interface NavbarProps {
  User: User | null;
  cartCount: number;
  onLogout: () => void;
}

export default function Navbar({ User, cartCount, onLogout }: NavbarProps) {
  const [vendorStore, setVendorStore] = useState<Store | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleStore = async () => {
    if (!vendorStore) return;
    const res = await apiDeactivateStore(vendorStore.storeId);
    if (res.success) {
      setVendorStore({ ...vendorStore, available: vendorStore.available === 1 ? 0 : 1 });
    }
  };

  useEffect(() => {
    if (User?.role === 'VENDOR' && User.storeId) {
      apiGetStoreById(User.storeId).then(res => {
        if (res.success && res.data) setVendorStore(res.data);
      });
    }
  }, [User?.storeId, User?.role]);

  return (
    <header className="bg-white border-b border-neutral-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:h-16 md:py-0 gap-3">
          <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
            PoliFood
          </Link>
          <div className="flex items-center gap-4 md:gap-8">

            <nav className="sm:flex items-center gap-2">
              {User?.role === 'ESTUDIANTE' && (
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
                  {vendorStore && (
                    <button
                      onClick={handleToggleStore}
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter cursor-pointer transition-colors ${
                        vendorStore.available === 1
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {vendorStore.available === 1 ? 'Abierto' : 'Cerrado'}
                    </button>
                  )}
                </>
              )}

              {User?.role === 'ADMIN' && (
                <>
                  <Link to="/" className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-primary">VENDEDORES</Link>
                  <Link to="/admin/stores" className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-primary">TIENDAS</Link>
                </>
              )}
            </nav>
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <div className="flex flex-col text-right leading-none">
                <span className="text-sm font-black text-neutral-800">
                  {User ? User.nombre.split(' ')[0] : null}
                </span>
                {User?.role === 'VENDOR' && vendorStore && (
                  <span className="text-[9px] uppercase font-black text-primary tracking-widest mt-0.5">
                    {vendorStore.nombre}
                  </span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm hover:scale-105 transition-transform cursor-pointer"
                >
                  {User?.nombre.charAt(0)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-100 shadow-xl rounded-2xl overflow-hidden py-1">
                    <Link
                      to="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                    >
                      <IoPersonOutline /> Mi Perfil
                    </Link>
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
