import { Link } from 'react-router-dom';
import type { Product, User } from '../types';
import { UserRole } from '../types';
import { STORES } from '../data/stores';
import { ORDERS } from '../data/orders';

interface HomePageProps {
  currentUser: User | null;
  products: Product[];
}

export const HomePage = ({ currentUser, products }: HomePageProps) => {
  const lastOrder = currentUser && currentUser.role === UserRole.Student
    ? [...ORDERS]
        .filter((order) => order.customerId === currentUser.id)
        .sort((a, b) => b.id - a.id)[0]
    : null;

  return (
    <div className="space-y-12">
      <header className="bg-white rounded-3xl shadow-sm p-10 border border-neutral-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-neutral-900 mb-3">
            Hola, <span className="text-primary">{currentUser?.name || 'Estudiante'}</span>
          </h1>
          <p className="text-neutral-600 text-lg max-w-xl">
            Selecciona una de nuestras tiendas del campus para realizar tu pedido.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
      </header>

      {lastOrder && (
        <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Tu último pedido
            </p>
            <h2 className="text-xl font-extrabold text-neutral-900 mt-1">
              Pedido #{lastOrder.id}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Revisa el estado o repite fácilmente tu último pedido.
            </p>
          </div>
          <Link
            to={`/order/${lastOrder.id}`}
            className="inline-flex items-center justify-center gap-2 text-white bg-primary font-bold px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ver detalle
            <span className="text-xl">→</span>
          </Link>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {STORES.map((store) => {
          const hasProducts = products.some(p => p.storeId === store.storeId);
          if (!hasProducts) return null;

          return (
            <section 
              key={store.storeId} 
              className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-extrabold text-neutral-800 group-hover:text-primary transition-colors">
                    {store.name}
                  </h2>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
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
          );
        })}
      </div>

      {/* 3. Empty State */}
      {STORES.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-neutral-100">
          <p className="text-neutral-400 text-lg font-medium">No hay tiendas disponibles actualmente.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;