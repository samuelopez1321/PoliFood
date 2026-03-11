import type { Order } from '../types';
import { orderStatuses } from '../types';

export const ORDERS: Order[] = [
  {
    id: 1,
    customerId: 1, // Juan Estudiante
    storeId: 1,    // PoliBurgers (Que lo administra Don Pepe)
    items: [
      { productId: 102, quantity: 1},
      { productId: 107, quantity: 1}
    ],
    total: 23000,
    status: orderStatuses.Recibido,
    createdAt: new Date().toISOString(),
    etaMinutes: 15
  },
  {
    id: 2,
    customerId: 1, // Juan Estudiante comprando en otra tienda
    storeId: 2,    // Healthy Campus (Que lo administra Maria Vendedora)
    items: [
      { productId: 108, quantity: 1},
      { productId: 110, quantity: 1}
    ],
    total: 27000,
    status: orderStatuses.Recibido,
    createdAt: new Date().toISOString(),
    etaMinutes: 12
  },
  {
    id: 3,
    customerId: 2, // Admin PoliFood (haciendo un pedido de prueba)
    storeId: 1,    // PoliBurgers
    items: [
      { productId: 103, quantity: 2}
    ],
    total: 32000,
    status: orderStatuses.EnCamino,
    createdAt: new Date().toISOString(),
    etaMinutes: 5
  }
];