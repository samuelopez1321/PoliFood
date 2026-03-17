// src/pages/OrderStatus.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetOrderById } from '../services/services';
import type { Order } from '../types';
import { PRODUCTS } from '../data/products';
import { STORES } from '../data/stores';

export const OrderStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarOrden = async () => {
      // Si no hay orderId en la URL, no cargar nada
      if (!orderId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // ✅ Llamar a la API para obtener la orden
        const resultado = await apiGetOrderById(Number(orderId));

        if (resultado.success && resultado.data) {
          setOrder(resultado.data);
        } else {
          setError(resultado.error || 'Orden no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la orden');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarOrden();
  }, [orderId]);

  // Si no hay orderId en la URL
  if (!orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">
            No hay orden seleccionada
          </h1>
          <p className="text-neutral-500 mb-6">
            Selecciona una orden para ver su estado
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8 text-center">
          <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Cargando orden...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12 text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">
            {error}
          </h1>
          <p className="text-neutral-500 mb-6">
            No pudimos encontrar la orden #{orderId}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // ❌ No order (aunque no debería pasar si hay error)
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-black text-neutral-900 mb-2">
            Orden no encontrada
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // ✅ SUCCESS - Mostrar orden
  const store = STORES.find(s => s.storeId === order.storeId);

  // Obtener productos de la orden
  const orderProducts = order.items.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return { ...item, product };
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl shadow-lg p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">
          Orden #{order.id}
        </h1>
        <p className="text-primary-light text-lg">
          Estado: {order.status}
        </p>
      </section>

      {/* Información de la orden */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
        {/* Tienda */}
        {store && (
          <div className="mb-6">
            <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Tienda</p>
            <p className="font-bold text-neutral-900 text-lg">{store.name}</p>
          </div>
        )}

        {/* ETA */}
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-6">
          <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Tiempo estimado</p>
          <p className="font-black text-primary text-2xl">{order.etaMinutes} minutos</p>
        </div>

        {/* Productos */}
        <div className="mb-6">
          <h3 className="font-bold text-neutral-700 text-sm uppercase tracking-wide mb-3">
            Productos
          </h3>
          <div className="space-y-3">
            {orderProducts.map((item) => (
              <div 
                key={item.productId}
                className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {item.product && (
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-neutral-200">
                      <img 
                        src={item.product.imgUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-neutral-900">
                      {item.product?.name || `Producto #${item.productId}`}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <span className="text-lg font-black text-neutral-900">Total</span>
          <span className="text-2xl font-black text-primary">
            ${order.total.toLocaleString()}
          </span>
        </div>

        {/* Fecha */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            Creado: {new Date(order.createdAt).toLocaleString('es-CO', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </section>

      {/* Botón volver */}
      <Link
        to="/"
        className="block text-center bg-white text-neutral-700 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-50 transition-all border border-neutral-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default OrderStatus;