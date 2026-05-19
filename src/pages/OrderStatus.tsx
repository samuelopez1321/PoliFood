import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetOrderById } from '../services/services';
import type { Order } from '../types';
import { orderStatuses } from '../types';
//Cada 10 segundos se pide el estado de la orden hasta que sea enviada
const POLL_INTERVAL_MS = 10000;
const PARAR_POLL_STATUS = orderStatuses.Enviado;

export const OrderStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); //Sirve para almacenar el intervalo de tiempo y el useRef es persistente entre renders

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const resultado = await apiGetOrderById(orderId);
      if (resultado.success && resultado.data) {
        setOrder(resultado.data);
        if (resultado.data.status === PARAR_POLL_STATUS) stopPolling();
      } else {
        setError(resultado.error || 'Orden no encontrada');
        stopPolling();
      }
    };

    setLoading(true);
    setError(null);
    fetchOrder().finally(() => setLoading(false));

    intervalRef.current = setInterval(fetchOrder, POLL_INTERVAL_MS);

    return stopPolling;
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">No hay orden seleccionada</h1>
          <p className="text-neutral-500 mb-6">Selecciona una orden para ver su estado</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

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

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm p-12 text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">{error}</h1>
          <p className="text-neutral-500 mb-6">No pudimos encontrar la orden #{orderId}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl shadow-lg p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">
          Orden #{order.orderId.slice(0, 8)}
        </h1>
        <p className="text-primary-light text-lg">
          Estado: {order.status}
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-6">
          <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Tiempo estimado</p>
          <p className="font-black text-primary text-2xl">{order.etaMinutes} minutos</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-neutral-700 text-sm uppercase tracking-wide mb-3">Productos</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-bold text-neutral-900">{item.productName}</p>
                  <p className="text-sm text-neutral-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-bold text-primary">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <span className="text-lg font-black text-neutral-900">Total</span>
          <span className="text-2xl font-black text-primary">${order.total.toLocaleString()}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            Creado: {new Date(order.createdAt).toLocaleString('es-CO', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <Link to="/" className="block text-center bg-white text-neutral-700 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-50 transition-all border border-neutral-200">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default OrderStatus;
