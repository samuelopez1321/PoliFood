import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order, User } from "../types";
import { apiGetOrdersByStudent } from "../services/services";

interface OrdersPageProps {
  currentUser: User | null;
}

export const OrdersPage = ({ currentUser }: OrdersPageProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    apiGetOrdersByStudent(currentUser.id).then(res => {
      if (res.success && res.data) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      }
      setLoading(false);
    });
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">No tienes pedidos aún</h1>
          <p className="text-neutral-500 text-base sm:text-lg mb-6">Realiza tu primera orden desde las tiendas del campus</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-white bg-primary font-bold px-6 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Explorar tiendas <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-2">Mis Pedidos</h1>
        <p className="text-neutral-500">Tienes {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total</p>
      </section>

      <div className="space-y-4">
        {orders.map((order) => {
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <div key={order.orderId} className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-neutral-100 gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-xl font-black text-neutral-900">Orden #{order.orderId.slice(0, 8)}</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">{order.status}</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-black text-primary">${order.total.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">{totalItems} producto{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{item.productName}</p>
                      <p className="text-sm text-neutral-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-neutral-700 flex-shrink-0">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase">Tiempo estimado</p>
                  <p className="font-black text-primary">{order.etaMinutes} minutos</p>
                </div>
              </div>

              <Link to={`/order/${order.orderId}`} className="block text-center bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors text-sm">
                Ver detalle →
              </Link>
            </div>
          );
        })}
      </div>

      <Link to="/" className="block text-center bg-white text-neutral-700 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-50 transition-all border border-neutral-200">
        Volver al inicio
      </Link>
    </div>
  );
};

export default OrdersPage;
