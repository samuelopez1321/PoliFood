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

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered';

export interface Order {
    id: number;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    createAt: string; // date string
    etaMinutes: number;
}