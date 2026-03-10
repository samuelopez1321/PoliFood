import { useState } from "react";
import type { User, Product, Store, Order } from '../types';
import { STORES } from '../data/stores';
import { ORDERS } from '../data/orders';
import { PRODUCTS } from '../data/products';
import { USERS } from '../data/users';
import { ORDER_STATUSES } from "../types";
import { IoClipboardOutline, IoTimeOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

interface VendorDashProps {
    currentUser: User | null;
}

export const VendorDash = ({ currentUser }: VendorDashProps) => {
    //Identificar la tienda a la que pertenecera el dashboard
    const store = STORES.find(s => s.storeId === currentUser?.storeId);
    const [storeOrders, setStoreOrders] = useState<Order[]>(
        ORDERS.filter(o => o.storeId === currentUser?.storeId)
    );
    //Obtener datos del cliente y los productos
    const getCustomerName = (id: number) => USERS.find(u => u.id === id)?.name || "Cliente desconocido";
    const getProductDetails = (id: number) => PRODUCTS.find(p => p.id === id);
    //Si no es un vendor no tiene acceso a este dashboard
    if (!store || currentUser?.role !== 'VENDOR') {
        return <div className="p-10 text-center">Acceso no autorizado</div>
    }
    //Ahora si podemos crear el dashboard
    return (
        <div className="space-y-8">
            <header className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900">{store.name}</h1>
                    <p className="text-neutral-500">Panel de administracion de pedidos</p>
                </div>
            </header>

            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Pedido</th>
                            <th className="px-6 py-4">Estado / ETA</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {storeOrders.map((order) => ( 
                            <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                                {/*Para cada orden, vamos a mostrar sus atributos en celdas de la tabla*/}
                                <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
                                <td className="px-6 py-4 font-medium text-neutral-800">
                                {getCustomerName(order.customerId)}
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600">
                                {order.items.map(item => {
                                    const p = getProductDetails(item.productId);
                                    return <div key={item.productId}>{item.quantity}x {p?.name}</div>;
                                })}
                                </td>
                                <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-amber-600 mb-1">
                                        <select
                                         className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                                {ORDER_STATUSES.map((estado) => (
                                                    <option key={estado} value={estado}>
                                                        {estado}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </span>
                                    <span className="text-xs text-neutral-400 flex items-center gap-1">
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
    )
}