import { useState, useEffect } from "react";
import type { User, Order, Store } from '../types';
import { orderStatuses } from "../types";
import { IoTimeOutline, IoPersonOutline, IoMailOutline } from "react-icons/io5";
import { apiGetStoreOrders, apiGetStoreById, apiUpdateOrderStatus } from '../services/services';

interface VendorDashProps {
  currentUser: User | null;
}

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

export const VendorDash = ({ currentUser }: VendorDashProps) => {
  const [storeData, setStoreData] = useState<Store | undefined>(undefined);
  const [storeOrders, setStoreOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.storeId) return;
    Promise.all([
      apiGetStoreById(currentUser.storeId),
      apiGetStoreOrders(currentUser.storeId),
    ]).then(([storeRes, ordersRes]) => {
      if (storeRes.success && storeRes.data) setStoreData(storeRes.data);
      if (ordersRes.success && ordersRes.data) {
        const sorted = [...ordersRes.data].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setStoreOrders(sorted);
      }
      setLoading(false);
    });
  }, [currentUser?.storeId]);

  if (currentUser?.role !== 'VENDOR') {
    return <div className="p-10 text-center">Acceso no autorizado</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!storeData) {
    return <div className="p-10 text-center">Tienda no encontrada</div>;
  }

  const STATUS_STEPS = Object.values(orderStatuses);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    const result = await apiUpdateOrderStatus(orderId, status);
    if (result.success) {
      setStoreOrders(prev =>
        prev.map(order => order.orderId === orderId ? { ...order, status } : order)
      );
    }
  };

  const todayOrders = storeOrders.filter(o => isToday(o.createdAt));
  const previousOrders = storeOrders.filter(o => !isToday(o.createdAt));

  const OrderTable = ({ orders }: { orders: Order[] }) => (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[780px]">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID / Fecha</th>
              <th className="px-6 py-4">Estudiante</th>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Estado / ETA</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-primary">#{order.orderId.slice(0, 8)}</p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <IoTimeOutline />
                    {formatDate(order.createdAt)}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <p className="font-bold text-neutral-800 flex items-center gap-1">
                    <IoPersonOutline className="text-neutral-400 flex-shrink-0" />
                    {order.studentName || '—'}
                  </p>
                  <p className="text-neutral-400 flex items-center gap-1 mt-0.5">
                    <IoMailOutline className="flex-shrink-0" />
                    {order.studentEmail || '—'}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {order.items.map(item => (
                    <div key={item.productId}>{item.quantity}x {item.productName}</div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <select
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value as Order['status'])}
                    >
                      {STATUS_STEPS.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    <span className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                      <IoTimeOutline /> {order.etaMinutes} min ETA
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-neutral-900">
                  ${order.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">{storeData.nombre}</h1>
          <p className="text-neutral-500">Panel de administracion de pedidos</p>
        </div>
      </header>

      {todayOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Hoy</h2>
          <OrderTable orders={todayOrders} />
        </div>
      )}

      {previousOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Anteriores</h2>
          <OrderTable orders={previousOrders} />
        </div>
      )}

      {storeOrders.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 p-12 text-center">
          <p className="text-neutral-400 font-medium">No hay pedidos aún.</p>
        </div>
      )}
    </div>
  );
};
