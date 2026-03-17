import type { Order, Product, User } from '../types';
import { orderStatuses } from '../types';

// URL base del servidor JSON
const API_BASE_URL = 'http://localhost:3001';
// ================================
// TIPO DE RESPUESTA
// ================================

// Todas las respuestas de la API tienen esta estructura
interface ApiResponse<T> {
  success: boolean;    // true si todo salió bien, false si hubo error
  data?: T;           // Los datos, T es un tipo de dato generico que puede tomar cualquier forma
  error?: string;     // Mensaje de error (olo si success es false
}

// ================================
// ORDERS
// ================================
export async function apiCreateOrder(
  cart: Product[],
  customerId: number,
  storeId: number
): Promise<ApiResponse<Order>> {
  try {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      return {
        success: false,
        error: 'El carrito está vacío'
      };
    }

    // Validar que todos los productos estén disponibles
    const productosNoDisponibles = cart.filter(producto => !producto.available);
    if (productosNoDisponibles.length > 0) {
      return {
        success: false,
        error: 'Algunos productos no están disponibles'
      };
    }

    // Agrupar productos por ID y contar cantidades, el producto en el indice i tienes productosAgrupados[i] unidades en la orden
    const productosAgrupados: Record<number, number> = {};
    
    for (const producto of cart) {
      if (productosAgrupados[producto.id]) {
        productosAgrupados[producto.id] = productosAgrupados[producto.id] + 1;
      } else {
        productosAgrupados[producto.id] = 1;
      }
    }

    // Convertir a items de orden
    const items = [];
    for (const productId in productosAgrupados) {
      items.push({
        productId: Number(productId),
        quantity: productosAgrupados[productId]
      });
    }

    // Calcular total
    let total = 0;
    for (const producto of cart) {
      total = total + producto.price;
    }

    // Calcular tiempo estimado
    let etaMinutes = 0;
    for (const producto of cart) {
      etaMinutes = etaMinutes + producto.prepTimeMinutes;
    }

    // Crear el objeto de la orden
    const nuevaOrden = {
      customerId: customerId,
      storeId: storeId,
      status: orderStatuses.Recibido,
      items: items,
      total: total,
      createdAt: new Date().toISOString(),
      etaMinutes: etaMinutes
    };

    // Enviar al servidor
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaOrden)
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al crear la orden'
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'No se pudo conectar al servidor'
    };
  }
}

export async function apiGetOrderById(id: number | string): Promise<ApiResponse<Order>> {
  try {
    //esperar a que json server cargue por que es como lento
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Orden no encontrada'
      };
    }
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'No se pudo conectar al servidor'
    };
  }
}