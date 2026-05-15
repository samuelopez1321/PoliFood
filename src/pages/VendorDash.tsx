import { useState, useEffect } from "react";
import type { User, Order, Store } from '../types';
import { orderStatuses } from "../types";
import { IoTimeOutline } from "react-icons/io5";
import { apiGetStoreOrders, apiGetStoreById, apiUpdateOrderStatus } from '../services/services';

interface VendorDashProps {
  currentUser: User | null;
}

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
      if (ordersRes.success && ordersRes.data) setStoreOrders(ordersRes.data);
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

  return (
    <div className="space-y-8">
      <header className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-neutral-900">{storeData.nombre}</h1>
          <p className="text-neutral-500">Panel de administracion de pedidos</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Estado / ETA</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {storeOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">#{order.orderId.slice(0, 8)}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {order.items.map(item => (
                    <div key={item.productId}>{item.quantity}x {item.productName}</div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <select
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value as Order['status'])}
                    >
                      {STATUS_STEPS.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    <span className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                      <IoTimeOutline /> {order.etaMinutes} min
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
};
