export enum UserRole {
    Student = "STUDENT",
    Vendor = "VENDOR",
    Admin = "ADMIN"
}


export interface User {
    id: number;
    name: string;
    role: UserRole;
    email: string;
    password: string;
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
export enum orderStatuses {
    Recibido = "RECIBIDO",
    Preparando = "Preparando",
    EnCamino = "En Camino",
    Enviado = "Enviado"
}


export interface Order {
    id: number | string;
    customerId: number;
    storeId: number;
    status: orderStatuses;
    items: OrderItem[];
    total: number;
    createdAt: string; // date string
    etaMinutes: number;
}