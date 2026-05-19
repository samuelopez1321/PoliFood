import { useState, useEffect } from 'react';
import type { User, Store } from '../types';
import { UserRole } from '../types';
import { IoPersonAddOutline, IoStorefrontOutline, IoTrashOutline, IoMailOutline } from "react-icons/io5";
import { Toast } from "../common/UI/Toast";
import type { ToastType } from "../common/UI/Toast";
import { apiGetVendors, apiGetStores, apiCreateVendor, apiDeactivateVendor } from '../services/services';

interface AdminPageProps {
  currentUser: User | null;
}

export const AdminPage = ({ currentUser: _currentUser }: AdminPageProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [newVendor, setNewVendor] = useState({ name: '', email: '', password: '', storeId: '' });
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });

  useEffect(() => {
    Promise.all([apiGetVendors(), apiGetStores()]).then(([vendorsRes, storesRes]) => {
      if (vendorsRes.success && vendorsRes.data) setAllUsers(vendorsRes.data);
      if (storesRes.success && storesRes.data) setAllStores(storesRes.data);
    });
  }, []);

  const vendors = allUsers.filter(u => u.role === UserRole.Vendor);

  const handleAddVendor = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email || !newVendor.password || !newVendor.storeId) return;
    const res = await apiCreateVendor({
      nombre: newVendor.name,
      email: newVendor.email,
      password: newVendor.password,
      storeId: newVendor.storeId,
    });
    if (res.success && res.data) {
      setAllUsers([...allUsers, res.data]);
      setNewVendor({ name: '', storeId: '', email: '', password: '' });
      setToast({ message: 'Vendedor creado correctamente.', type: 'success', isVisible: true });
    } else {
      setToast({ message: res.error ?? 'Error al crear vendedor', type: 'error', isVisible: true });
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este vendedor?')) return;
    const res = await apiDeactivateVendor(id);
    if (res.success) {
      setAllUsers(allUsers.filter(user => user.id !== id));
    } else {
      setToast({ message: res.error ?? 'Error al desactivar vendedor', type: 'error', isVisible: true });
    }
  };

return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">Gestión de Plataforma</h1>
        <p className="text-neutral-500">Administrar los vendedores</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <IoPersonAddOutline className="text-2xl" />
            <h2 className="text-xl font-bold text-neutral-800">Nuevo Vendedor</h2>
          </div>
          <form onSubmit={handleAddVendor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre Completo</label>
              <input type="text" value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input type="email" value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Contraseña (mín. 12 caracteres)</label>
              <input type="password" value={newVendor.password}
                onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Asignar Tienda</label>
              <select value={newVendor.storeId}
                onChange={(e) => setNewVendor({...newVendor, storeId: e.target.value})}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none">
                <option value="">Seleccionar tienda...</option>
                {allStores.map(store => (
                  <option key={store.storeId} value={store.storeId}>{store.nombre}</option>
                ))}
              </select>
            </div>
            <button type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Crear Vendedor
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800">Vendedores Activos</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[580px]">
            <thead className="bg-neutral-50 text-neutral-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Tienda Asignada</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {vendors.map((v) => {
                const store = allStores.find(s => s.storeId === v.storeId);
                return (
                  <tr key={v.id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4 font-bold text-neutral-800">{v.nombre}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-neutral-500">
                        <IoMailOutline className="text-primary flex-shrink-0" />
                        {v.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-neutral-600">
                        <IoStorefrontOutline className="text-primary" />
                        {store?.nombre || 'Sin tienda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button onClick={() => handleDeleteVendor(v.id)}
                        className="text-red-400 hover:text-red-600 p-2 cursor-pointer transition-colors" title="Eliminar Vendedor">
                        <IoTrashOutline size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </section>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })} />
    </div>
  );
};
