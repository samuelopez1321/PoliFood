import type { User } from '../types';
import { UserRole } from '../types';
export const USERS: User[] = [
    {
    id: 1,
    name: "Juan Estudiante",
    role: UserRole.Student 
  },
  {
    id: 2,
    name: "Admin PoliFood",
    role: UserRole.Admin 
  },
  {
    id: 3,
    name: "Don Pepe",
    role: UserRole.Vendor, 
    storeId: 1      
  },
  {
    id: 4,
    name: "Maria Vendedora",
    role: UserRole.Vendor, 
    storeId: 2
  } 
];