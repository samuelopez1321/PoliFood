export enum UserRole {
    Student = "ESTUDIANTE",
    Vendor = "VENDOR",
    Admin = "ADMIN"
}

export interface User {
    id: string;
    nombre: string;
    role: UserRole;
    email: string;
    storeId?: string;
}

export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    prepTimeMinutes: number;
    storeId: string;
    category: string;
    isAvailable: boolean;
}

export interface Store {
    storeId: string;
    nombre: string;
    available: number;
    categories: string[];
}

export interface OrderItemResponse {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export enum orderStatuses {
    Recibido = "RECIBIDO",
    Preparando = "PREPARANDO",
    EnCamino = "EN_CAMINO",
    Enviado = "ENVIADO"
}

export interface Order {
    orderId: string;
    studentId: string;
    storeId: string;
    status: orderStatuses;
    items: OrderItemResponse[];
    total: number;
    createdAt: string;
    etaMinutes: number;
}
