import type { Order, Product, Store, User, UserRole } from '../types';

const API_BASE_URL = 'https://localhost:7173';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

//Token utilities
export function getToken(): string | null {
  return sessionStorage.getItem('authTokenJWT');
}
export function setToken(token: string): void {
  sessionStorage.setItem('authTokenJWT', token);
}
export function removeToken(): void {
  sessionStorage.removeItem('authTokenJWT');
}
function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Auth ───────────────────────────────────────────────────────
export async function apiLogin(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Password: password }),
    });
    if (!res.ok) return { success: false, error: 'Email o contraseña incorrectos' };
    const body = await res.json();
    setToken(body.token);
    return { success: true, data: { id: body.id, nombre: body.nombre, email: body.email, role: body.role as UserRole, storeId: body.storeId ?? undefined } };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiRegister(
  nombre: string,
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/estudiante`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!res.ok) return { success: false, error: 'Error al registrarse. Revisa los datos.' };
    const body = await res.json();
    setToken(body.token);
    return { success: true, data: { id: body.id, nombre: body.nombre, email: body.email, role: body.role as UserRole, storeId: body.storeId ?? undefined } };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

// ── Stores ─────────────────────────────────────────────────────
export async function apiGetStores(): Promise<ApiResponse<Store[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stores`);
    if (!res.ok) return { success: false, error: 'Error al cargar tiendas' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiGetStoreById(storeId: string): Promise<ApiResponse<Store>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stores/${storeId}`);
    if (!res.ok) return { success: false, error: 'Tienda no encontrada' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

// ── Products ───────────────────────────────────────────────────
export async function apiGetProductsByStore(storeId: string): Promise<ApiResponse<Product[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/store/${storeId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al cargar productos' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiCreateProduct(dto: {
  name: string; description: string; price: number;
  imageUrl: string; category: string; storeId: string;
  isAvailable: boolean; prepTimeMinutes: number;
}): Promise<ApiResponse<Product>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) return { success: false, error: 'Error al crear producto' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiToggleProductAvailability(productId: string): Promise<ApiResponse<boolean>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al cambiar disponibilidad' };
    return { success: true, data: true };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiDeleteProduct(productId: string): Promise<ApiResponse<boolean>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al eliminar producto' };
    return { success: true, data: true };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

// ── Orders ─────────────────────────────────────────────────────
export async function apiCreateOrder(
  cart: Product[],
  studentId: string,
  storeId: string
): Promise<ApiResponse<Order>> {
  if (cart.length === 0) return { success: false, error: 'El carrito está vacío' };

  const grouped: Record<string, number> = {};
  for (const p of cart) {
    grouped[p.productId] = (grouped[p.productId] ?? 0) + 1;
  }
  const items = Object.entries(grouped).map(([productId, quantity]) => ({ productId, quantity }));

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ studentId, storeId, items }),
    });
    if (!res.ok) return { success: false, error: 'Error al crear la orden' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiGetOrderById(id: string): Promise<ApiResponse<Order>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Orden no encontrada' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiGetOrdersByStudent(studentId: string): Promise<ApiResponse<Order[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/student/${studentId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al cargar pedidos' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiGetStoreOrders(storeId: string): Promise<ApiResponse<Order[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/store/${storeId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al cargar pedidos de la tienda' };
    return { success: true, data: await res.json() };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiUpdateOrderStatus(
  orderId: string,
  status: string
): Promise<ApiResponse<boolean>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return { success: false, error: 'Error al actualizar estado' };
    return { success: true, data: true };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

// ── Admin/Vendor users ─────────────────────────────────────────
export async function apiGetVendors(): Promise<ApiResponse<User[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vendor`, { headers: authHeaders() });
    if (!res.ok) return { success: false, error: 'Error al cargar vendedores' };
    const data = await res.json();
    const users: User[] = data.map((v: { id: string; nombre: string; email: string; storeId: string }) => ({
      id: v.id, nombre: v.nombre, email: v.email,
      role: 'VENDOR' as UserRole, storeId: v.storeId?.toString(),
    }));
    return { success: true, data: users };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiCreateVendor(dto: {
  nombre: string; email: string; password: string; storeId: string;
}): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vendor`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message ?? 'Error al crear vendedor' };
    }
    const data = await res.json();
    return {
      success: true,
      data: { id: data.id, nombre: data.nombre, email: data.email, role: 'VENDOR' as UserRole, storeId: data.storeId?.toString() },
    };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}

export async function apiDeactivateVendor(vendorId: string): Promise<ApiResponse<boolean>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vendor/${vendorId}`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) return { success: false, error: 'Error al desactivar vendedor' };
    return { success: true, data: true };
  } catch {
    return { success: false, error: 'No se pudo conectar al servidor' };
  }
}
