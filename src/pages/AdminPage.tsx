import { useState } from 'react';
import type { User, Store } from '../types';
import { USERS } from '../data/users';
import { STORES } from '../data/stores';
import { UserRole } from '../types';
import { IoPersonAddOutline, IoStorefrontOutline, IoTrashOutline } from "react-icons/io5";
import { CgPassword } from 'react-icons/cg';
import { Toast } from "../common/UI/Toast";
import type { ToastType } from "../common/UI/Toast";

interface AdminPageProps {
    currentUser: User | null;
}

export const AdminPage = ({currentUser}: AdminPageProps) => {
    const[allUsers, setAllUsers] = useState<User[]>(USERS);
    const [allStores, setAllStores] = useState<Store[]>(STORES);
    const [newVendor, setNewVendor] = useState({
        name: '',
        email: '',
        password: '',
        storeId:''
    });
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });
    const vendors = allUsers.filter(u => u.role === UserRole.Vendor);
    const handleAddVendor = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newVendor.name || !newVendor.storeId) return;

            const newUser: User = {
            id: allUsers.length + 1,
            name: newVendor.name,
            email: newVendor.email,
            password: newVendor.password,
            role: UserRole.Vendor,
            storeId: Number(newVendor.storeId)
        };
        setAllUsers([...allUsers, newUser])
        setNewVendor({ name: '', storeId: '', email: '', password: ''});
    };

    const handleDeleteVendor = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este vendedor?')) {
            setAllUsers(allUsers.filter(user => user.id !== id));
        }
    };

    const handleResetPassword = (id: number) => {
        const vendor = allUsers.find(u => u.id === id && u.role === UserRole.Vendor);
        if (!vendor) return;

        setAllUsers(allUsers.map(user =>
            user.id === id ? { ...user, password: '1234' } : user
        ));
        setToast({
            message: 'Contraseña restablecida a 1234 para este vendedor.',
            type: 'success',
            isVisible: true
        });
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-black text-neutral-900">Gestión de Plataforma</h1>
                <p className="text-neutral-500">Administrar los vendedores</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <IoPersonAddOutline className="text-2xl" />
                        <h2 className="text-xl font-bold text-neutral-800">Nuevo Vendedor</h2>
                    </div>
                    
                    <form onSubmit={handleAddVendor} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre Completo</label>
                            <input 
                                type="text"
                                value={newVendor.name}
                                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                            <input 
                                type="email"
                                value={newVendor.email}
                                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Contraseña</label>
                            <input 
                                type="password"
                                value={newVendor.password}
                                onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Asignar Tienda</label>
                            <select 
                                value={newVendor.storeId}
                                onChange={(e) => setNewVendor({...newVendor, storeId: e.target.value})}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="">Seleccionar tienda...</option>
                                {allStores.map(store => (
                                    <option key={store.storeId} value={store.storeId}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            Crear Vendedor
                        </button>
                    </form>
                </section>
                {/* Tabla de Vendedores Actuales */}
                <section className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-100">
                        <h2 className="text-xl font-bold text-neutral-800">Vendedores Activos</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-neutral-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Tienda Asignada</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {vendors.map((v) => {
                                const store = allStores.find(s => s.storeId === v.storeId);
                                return (
                                    <tr key={v.id} className="hover:bg-neutral-50/50">
                                        <td className="px-6 py-4 font-mono text-xs">{v.id}</td>
                                        <td className="px-6 py-4 font-bold text-neutral-800">{v.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-sm text-neutral-600">
                                                <IoStorefrontOutline className="text-primary" />
                                                {store?.name || 'Sin tienda'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <button
                                                onClick={() => handleResetPassword(v.id)}
                                                className="text-neutral-400 hover:text-primary p-2 transition-colors"
                                                title="Restablecer contraseña"
                                            >
                                                <CgPassword size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVendor(v.id)}
                                                className="text-red-400 hover:text-red-600 p-2 transition-colors"
                                                title="Eliminar Vendedor"
                                            >
                                                <IoTrashOutline size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}