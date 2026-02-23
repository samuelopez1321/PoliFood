import type { User } from '../types';

export const USERS: User[] = [
    {
    id: 1,
    name: "Juan Estudiante",
    role: "STUDENT" 
  },
  {
    id: 2,
    name: "Admin PoliFood",
    role: "ADMIN" 
  },
  {
    id: 3,
    name: "Don Pepe",
    role: "VENDOR", 
    storeId: 1      
  },
  {
    id: 4,
    name: "Maria Vendedora",
    role: "VENDOR", 
    storeId: 2
  } 
];