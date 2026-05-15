import { useState, useEffect } from "react";
import type { User, Product, Store } from '../types';
import { IoAddCircleOutline, IoFastFoodOutline, IoTrashOutline } from "react-icons/io5";
import { Toast } from "../common/UI/Toast";
import type { ToastType } from "../common/UI/Toast";
import { apiGetProductsByStore, apiGetStoreById, apiCreateProduct, apiToggleProductAvailability, apiDeleteProduct } from '../services/services';

interface VendorMenuAdminProps {
  currentUser: User | null;
}

export const VendorMenuAdmin = ({ currentUser }: VendorMenuAdminProps) => {
  const [storeData, setStoreData] = useState<Store | undefined>(undefined);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', imageUrl: '', prepTimeMinutes: '', category: ''
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });

  useEffect(() => {
    if (!currentUser?.storeId) return;
    Promise.all([
      apiGetStoreById(currentUser.storeId),
      apiGetProductsByStore(currentUser.storeId),
    ]).then(([storeRes, productsRes]) => {
      if (storeRes.success && storeRes.data) setStoreData(storeRes.data);
      if (productsRes.success && productsRes.data) setStoreProducts(productsRes.data);
    });
  }, [currentUser?.storeId]);

  const handleAddProduct = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !storeData || !currentUser?.storeId) return;
    const result = await apiCreateProduct({
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      imageUrl: productForm.imageUrl || '',
      prepTimeMinutes: Number(productForm.prepTimeMinutes) || 15,
      storeId: currentUser.storeId,
      category: productForm.category,
      isAvailable: true,
    });
    if (result.success && result.data) {
      setStoreProducts(prev => [...prev, result.data!]);
      setProductForm({ name: '', description: '', price: '', imageUrl: '', prepTimeMinutes: '', category: '' });
      setToast({ message: 'Producto añadido al menú.', type: 'success', isVisible: true });
    } else {
      setToast({ message: result.error ?? 'Error al crear producto', type: 'error', isVisible: true });
    }
  };

  const handleToggleAvailability = async (productId: string) => {
    const result = await apiToggleProductAvailability(productId);
    if (result.success) {
      setStoreProducts(prev =>
        prev.map(p => p.productId === productId ? { ...p, isAvailable: !p.isAvailable } : p)
      );
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Eliminar este producto del menú?')) return;
    const result = await apiDeleteProduct(productId);
    if (result.success) {
      setStoreProducts(prev => prev.filter(p => p.productId !== productId));
    }
  };

  if (!storeData) return <div className="p-10 text-center font-bold">Tienda no vinculada</div>;

  return (
    <div className="space-y-8 p-4">
      <header>
        <h1 className="text-3xl font-black text-neutral-900">Panel de Menú</h1>
        <p className="text-neutral-500">Gestionando: <span className="font-bold text-orange-500">{storeData.nombre}</span></p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="h-fit sticky top-6">
          <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-md">
            <div className="flex items-center gap-2 mb-6 text-orange-500">
              <IoAddCircleOutline className="text-2xl" />
              <h2 className="text-xl font-bold text-neutral-800">Añadir Plato</h2>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">Nombre</label>
                <input type="text" value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">Descripción</label>
                <input type="text" value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-neutral-600 mb-1">Precio</label>
                  <input type="number" value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-600 mb-1">Minutos</label>
                  <input type="number" value={productForm.prepTimeMinutes}
                    onChange={(e) => setProductForm({...productForm, prepTimeMinutes: e.target.value})}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">URL Imagen (opcional)</label>
                <input type="url" value={productForm.imageUrl}
                  onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">Categoría</label>
                <select value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required>
                  <option value="">Seleccionar Categoria</option>
                  {storeData.categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-transform active:scale-95 shadow-lg">
                Guardar en Menú
              </button>
            </form>
          </section>
        </aside>

        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex justify-between items-center shadow-sm">
            <h2 className="font-bold text-neutral-800 italic">Productos en el menu</h2>
            <IoFastFoodOutline className="text-neutral-300 text-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeProducts.map(product => (
              <div key={product.productId} className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-xl">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-800">{product.name}</p>
                    <p className="text-sm text-orange-500 font-medium">${product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleAvailability(product.productId)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {product.isAvailable ? 'Activo' : 'Agotado'}
                  </button>
                  <button onClick={() => handleDeleteProduct(product.productId)}
                    className="p-2 text-neutral-300 hover:text-red-500 transition-colors">
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })} />
    </div>
  );
};
