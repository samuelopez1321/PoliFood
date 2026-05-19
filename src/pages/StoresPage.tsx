import { useState, useEffect } from 'react';
import type { Store } from '../types';
import { IoStorefrontOutline, IoTrashOutline } from "react-icons/io5";
import { Toast } from "../common/UI/Toast";
import type { ToastType } from "../common/UI/Toast";
import { apiGetStores, apiCreateStore, apiDeactivateStore } from '../services/services';

export const StoresPage = () => {
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [newStore, setNewStore] = useState({ nombre: '', categories: '', logoUrl: '' });
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });

  useEffect(() => {
    apiGetStores().then(res => {
      if (res.success && res.data) setAllStores(res.data);
    });
  }, []);

  const handleAddStore = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newStore.nombre) return;
    const categories = newStore.categories
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    const res = await apiCreateStore({ nombre: newStore.nombre, categories, logoUrl: newStore.logoUrl || undefined });
    if (res.success && res.data) {
      setAllStores([...allStores, res.data]);
      setNewStore({ nombre: '', categories: '', logoUrl: '' });
      setToast({ message: 'Tienda creada correctamente.', type: 'success', isVisible: true });
    } else {
      setToast({ message: res.error ?? 'Error al crear tienda', type: 'error', isVisible: true });
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar esta tienda?')) return;
    const res = await apiDeactivateStore(storeId);
    if (res.success) {
      setAllStores(allStores.filter(s => s.storeId !== storeId));
    } else {
      setToast({ message: res.error ?? 'Error al desactivar tienda', type: 'error', isVisible: true });
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">Gestión de Tiendas</h1>
        <p className="text-neutral-500">Administrar las tiendas de la plataforma</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <IoStorefrontOutline className="text-2xl" />
            <h2 className="text-xl font-bold text-neutral-800">Nueva Tienda</h2>
          </div>
          <form onSubmit={handleAddStore} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
              <input type="text" value={newStore.nombre}
                onChange={(e) => setNewStore({ ...newStore, nombre: e.target.value })}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Categorías (separadas por coma)</label>
              <input type="text" value={newStore.categories}
                placeholder="Combos, Bebidas, Snacks"
                onChange={(e) => setNewStore({ ...newStore, categories: e.target.value })}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">URL del Logo (opcional)</label>
              <input type="url" value={newStore.logoUrl}
                placeholder="https://ejemplo.com/logo.png"
                onChange={(e) => setNewStore({ ...newStore, logoUrl: e.target.value })}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Crear Tienda
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800">Tiendas Activas</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[480px]">
            <thead className="bg-neutral-50 text-neutral-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Tienda</th>
                <th className="px-6 py-4">Categorías</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allStores.map((store) => (
                <tr key={store.storeId} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {store.logoUrl ? (
                        <img src={store.logoUrl} alt={store.nombre} className="h-9 w-9 rounded-xl object-cover border border-neutral-100" />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-black">
                          {store.nombre.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-neutral-800">{store.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {store.categories?.join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteStore(store.storeId)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors" title="Desactivar Tienda">
                      <IoTrashOutline size={18} />
                    </button>
                  </td>
                </tr>
              ))}
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
