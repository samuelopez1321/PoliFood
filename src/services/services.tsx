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

/**
 * Obtener TODAS las órdenes
 * GET http://localhost:3001/orders
 */
export async function apiGetAllOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener las órdenes'
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

/**
 * Obtener UNA orden por ID
 * GET http://localhost:3001/orders/1
 */
export async function apiGetOrderById(id: number): Promise<ApiResponse<Order>> {
  try {
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

/**
 * Obtener las órdenes de UN cliente específico
 * GET http://localhost:3001/orders?customerId=1
 */
export async function apiGetCustomerOrders(customerId: number): Promise<ApiResponse<Order[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?customerId=${customerId}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener las órdenes del cliente'
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

/**
 * Obtener las órdenes de UNA tienda específica
 * GET http://localhost:3001/orders?storeId=1
 */
export async function apiGetStoreOrders(storeId: number): Promise<ApiResponse<Order[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?storeId=${storeId}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener las órdenes de la tienda'
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

/**
 * CREAR una nueva orden
 * POST http://localhost:3001/orders
 */
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

/**
 * ACTUALIZAR el estado de una orden
 * PATCH http://localhost:3001/orders/1
 */
export async function apiUpdateOrderStatus(
  orderId: number,
  nuevoEstado: orderStatuses
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nuevoEstado })
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al actualizar el estado'
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

// ================================
// USERS - USUARIOS
// ================================

/**
 * LOGIN - Iniciar sesión
 * GET http://localhost:3001/users?email=X
 */
export async function apiLogin(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  try {
    // Buscar usuario por email
    const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Error al buscar el usuario'
      };
    }

    const usuarios = await response.json();

    // Verificar si se encontró el usuario
    if (usuarios.length === 0) {
      return {
        success: false,
        error: 'Email o contraseña incorrectos'
      };
    }

    const usuario = usuarios[0];

    // Verificar la contraseña
    if (usuario.password !== password) {
      return {
        success: false,
        error: 'Email o contraseña incorrectos'
      };
    }

    return {
      success: true,
      data: usuario
    };
  } catch (error) {
    return {
      success: false,
      error: 'No se pudo conectar al servidor'
    };
  }
}

/**
 * CREAR un nuevo usuario (para Admin crear vendors)
 * POST http://localhost:3001/users
 */
export async function apiCreateUser(
  name: string,
  email: string,
  password: string,
  role: string,
  storeId?: number
): Promise<ApiResponse<User>> {
  try {
    const nuevoUsuario = {
      name: name,
      email: email,
      password: password,
      role: role,
      storeId: storeId
    };

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al crear el usuario'
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

// ================================
// PRODUCTS - PRODUCTOS
// ================================

/**
 * Obtener TODOS los productos (o filtrar por tienda)
 * GET http://localhost:3001/products
 * GET http://localhost:3001/products?storeId=1
 */
export async function apiGetProducts(storeId?: number): Promise<ApiResponse<Product[]>> {
  try {
    let url = `${API_BASE_URL}/products`;
    
    // Si se proporciona storeId, filtrar por tienda
    if (storeId) {
      url = `${API_BASE_URL}/products?storeId=${storeId}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener los productos'
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

/**
 * CREAR un nuevo producto
 * POST http://localhost:3001/products
 */
export async function apiCreateProduct(
  name: string,
  description: string,
  price: number,
  imgUrl: string,
  prepTimeMinutes: number,
  available: boolean,
  storeId: number,
  category: string
): Promise<ApiResponse<Product>> {
  try {
    const nuevoProducto = {
      name: name,
      description: description,
      price: price,
      imgUrl: imgUrl,
      prepTimeMinutes: prepTimeMinutes,
      available: available,
      storeId: storeId,
      category: category
    };

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto)
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al crear el producto'
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

/**
 * ACTUALIZAR un producto
 * PATCH http://localhost:3001/products/102
 */
export async function apiUpdateProduct(
  productId: number,
  name?: string,
  description?: string,
  price?: number,
  available?: boolean
): Promise<ApiResponse<Product>> {
  try {
    const actualizaciones: any = {};
    
    if (name) actualizaciones.name = name;
    if (description) actualizaciones.description = description;
    if (price) actualizaciones.price = price;
    if (available !== undefined) actualizaciones.available = available;

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actualizaciones)
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al actualizar el producto'
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