import { Link } from 'react-router-dom';
import type { Order, User } from "../types";
import { PRODUCTS } from "../data/products";
import { ORDERS } from "../data/orders";
import { STORES } from "../data/stores";

interface OrdersPageProps {
  currentUser: User | null;
}

export const OrdersPage = ({ currentUser }: OrdersPageProps) => {
  // Filtrar órdenes del usuario actual y ordenar por fecha (más reciente primero)
  const orders = ORDERS
    .filter(o => o.customerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Estado vacío
  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">
            No tienes pedidos aún
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg mb-6">
            Realiza tu primera orden desde las tiendas del campus
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-white bg-primary font-bold px-6 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Explorar tiendas
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-2">
          Mis Pedidos
        </h1>
        <p className="text-neutral-500">
          Tienes {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>
      </section>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {orders.map((order) => {
          const store = STORES.find(s => s.storeId === order.storeId);
          
          // Obtener productos de la orden
          const orderProducts = order.items.map(item => {
            const product = PRODUCTS.find(p => p.id === item.productId);
            return { ...item, product };
          });

          // Calcular cantidad total de items
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div 
              key={order.id}
              className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Header de la orden */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-neutral-100 gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-xl font-black text-neutral-900">
                      Orden #{order.id}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                      {order.status}
                    </span>
                  </div>
                  
                  {store && (
                    <p className="text-sm font-medium text-neutral-600 mb-1">
                        {store.name}
                    </p>
                  )}
                  
                  <p className="text-xs text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-2xl font-black text-primary">
                    ${order.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {totalItems} producto{totalItems !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div className="space-y-2 mb-4">
                {orderProducts.map((item) => (
                  <div 
                    key={item.productId}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl"
                  >
                    {item.product && (
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                        <img 
                          src={item.product.imgUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 truncate">
                        {item.product?.name || `Producto #${item.productId}`}
                      </p>
                      <p className="text-sm text-neutral-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-neutral-700 flex-shrink-0">
                      ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* ETA */}
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase">Tiempo estimado</p>
                  <p className="font-black text-primary">{order.etaMinutes} minutos</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón volver */}
      <Link
        to="/"
        className="block text-center bg-white text-neutral-700 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-50 transition-all border border-neutral-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default OrdersPage;