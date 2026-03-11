import type { User } from '../types';
import { UserRole } from '../types';
export const USERS: User[] = [
    {
    id: 1,
    name: "Juan Estudiante",
    email: "juan@gmail.com",
    password: "1234",
    role: UserRole.Student 
  },
  {
    id: 2,
    name: "Admin PoliFood",
    email: "admin@polifood.com",
    password: "admin",
    role: UserRole.Admin 
  },
  {
    id: 3,
    name: "Don Pepe",
    role: UserRole.Vendor, 
    email: "pepe@outlook.com",
    password: "pepe",
    storeId: 1      
  },
  {
    id: 4,
    name: "Maria Vendedora",
    role: UserRole.Vendor, 
    email: "maria@hotmail.com",
    password: "maria",
    storeId: 2
  } 
];