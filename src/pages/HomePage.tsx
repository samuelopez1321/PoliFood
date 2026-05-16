import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User, Store } from '../types';
import { apiGetStores } from '../services/services';

interface HomePageProps {
  currentUser: User | null;
}

export const HomePage = ({ currentUser }: HomePageProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetStores().then(res => {
      if (res.success && res.data) setStores(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="bg-white rounded-3xl shadow-sm p-10 border border-neutral-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-neutral-900 mb-3">
            Hola, <span className="text-primary">{currentUser?.nombre || 'Estudiante'}</span>
          </h1>
          <p className="text-neutral-600 text-lg max-w-xl">
            Selecciona una de nuestras tiendas <b>abiertas</b> del campus para realizar tu pedido.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {stores.filter(s => s.available === 1).map((store) => (
          <section
            key={store.storeId}
            className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {store.logoUrl ? (
                    <img src={store.logoUrl} alt={store.nombre} className="h-14 w-14 rounded-2xl object-cover border border-neutral-100 shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black flex-shrink-0">
                      {store.nombre.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-2xl font-extrabold text-neutral-800 group-hover:text-primary transition-colors leading-tight">
                    {store.nombre}
                  </h2>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase flex-shrink-0">
                  Abierta
                </span>
              </div>
            </div>
            <Link
              to={`/store/${store.storeId}`}
              className="w-full flex justify-center items-center gap-2 text-white bg-primary font-bold px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Ver todo el menú
              <span className="text-xl">→</span>
            </Link>
          </section>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-neutral-100">
          <p className="text-neutral-400 text-lg font-medium">No hay tiendas disponibles actualmente.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
