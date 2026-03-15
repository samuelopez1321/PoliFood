import type { Order, Product, OrderItem } from '../types';
import { orderStatuses } from '../types';

interface GroupedCartItem {
  product: Product;
  quantity: number;
}

export const generateOrderId = (): number => {
  return Date.now(); // Simple timestamp como ID
};

export const calculateTotalTime = (items: GroupedCartItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

export const calculateETA = (prepTimeMinutes: number, queuePosition: number): number => {
  return prepTimeMinutes + (queuePosition * 5); // +5 min por cada orden adelante
};

/**
 * Convierte items del carrito a OrderItems
 */
export const cartToOrderItems = (cart: Product[]): OrderItem[] => {
  // Agrupar productos por ID y contar cantidad
  const grouped = cart.reduce<Record<number, number>>((acc, product) => {
    acc[product.id] = (acc[product.id] || 0) + 1;
    return acc;
  }, {});

  // Convertir a OrderItem[]
  return Object.entries(grouped).map(([productId, quantity]) => ({
    productId: Number(productId),
    quantity
  }));
};

/**
 * Crea una nueva orden
 */
export const createOrder = (
  cart: Product[],
  customerId: number,
  storeId: number
): Order => {
  const items = cartToOrderItems(cart);
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  
  // Agrupar para calcular tiempo de preparación
  const groupedItems = cart.reduce<Record<number, GroupedCartItem>>((acc, product) => {
    if (acc[product.id]) {
      acc[product.id].quantity += 1;
    } else {
      acc[product.id] = { product, quantity: 1 };
    }
    return acc;
  }, {});

  const prepTimeMinutes = calculateTotaTime(Object.values(groupedItems));
  const etaMinutes = calculateETA(prepTimeMinutes, 0); // 0 = primera posición en cola

  return {
    id: generateOrderId(),
    customerId,
    storeId,
    status: orderStatuses.Recibido,
    items,
    total,
    createdAt: new Date().toISOString(),
    etaMinutes
  };
};

/**
 * Guarda orden en localStorage
 */
export const saveOrder = (order: Order): void => {
  try {
    const existingOrders = getOrders();
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  } catch (error) {
    console.error('Error al guardar orden:', error);
  }
};

/**
 * Obtiene todas las órdenes de localStorage
 */
export const getOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem('orders');
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
    return [];
  }
};

/**
 * Obtiene una orden por ID
 */
export const getOrderById = (orderId: number): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId) || null;
};

/**
 * Obtiene órdenes de un estudiante
 */
export const getOrdersByCustomer = (customerId: number): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.customerId === customerId);
};

/**
 * Obtiene órdenes de una tienda
 */
export const getOrdersByStore = (storeId: number): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.storeId === storeId);
};