export type UserRole = 'STUDENT' | 'VENDOR' | 'ADMIN';


export interface User {
    id: number;
    name: string;
    role: UserRole;
    storeId?: number; // Solo para vendors
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string
    prepTimeMinutes: number;
    available: boolean;
    storeId: number;
    category: string;
}

export interface Store {
    storeId: number;
    name: string;
    categories: string[];
}

export interface OrderItem {
    productId: number;
    quantity: number;
}
export const ORDER_STATUSES = ['RECIBIDO', 'PREPARANDO', 'EN CAMINO', 'ENVIADO'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface Order {
    id: number;
    customerId: number;
    storeId: number;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    createdAt: string; // date string
    etaMinutes: number;
}