import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoCartOutline, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import type { Product } from "../types";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Modal } from '../common/UI/Modal';
import { Toast } from "../common/UI/Toast";
import type { ToastType } from '../common/UI/Toast';

interface CartPageProps {
  cart: Product[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => Promise<number | null>;
}

interface GroupedCartItem {
  product: Product;
  quantity: number;
}

export const CartPage = ({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout
}: CartPageProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const groupedCartItems = cart.reduce<Record<number, GroupedCartItem>>(
    (acc, product) => {
      if (acc[product.id]) {
        acc[product.id].quantity += 1;
      } else {
        acc[product.id] = {
          product,
          quantity: 1,
        };
      }
      return acc;
    },
    {}
  );

  const cartItems = Object.values(groupedCartItems);
  const subtotal = cart.reduce((sum, product) => sum + product.price, 0);
  const impuestos = 0;
  const total = subtotal + impuestos;
  const totalItems = cart.length;

  // Verificar productos no disponibles
  const unavailableProducts = cart.filter(p => !p.available);
  const hasUnavailableProducts = unavailableProducts.length > 0;

  // Calcular tiempo estimado de preparación
  const estimatedTime = cartItems.reduce((total, item) => {
    return total + item.product.prepTimeMinutes;
  }, 0);

  // Manejar click en finalizar pedido
  const handleCheckoutClick = () => {
    if (hasUnavailableProducts) {
      setToast({
        message: 'Algunos productos no están disponibles. Elimínalos para continuar.',
        type: 'error',
        isVisible: true
      });
      return;
    }
    setShowModal(true);
  };

  //Confirmar pedido con la API
  const handleConfirmCheckout = async () => {
    setIsProcessing(true);

    try {
      //Llamar a onCheckout (que viene de App.tsx)
      const orderId = await onCheckout();

      setIsProcessing(false);

      if (orderId) {
        setShowModal(false);
        setToast({
          message: '¡Pedido creado exitosamente!',
          type: 'success',
          isVisible: true
        });

        // Redirigir después de 1 segundo
         navigate(`/order/${orderId}`);

      } else {
        setToast({
          message: 'Error al crear el pedido. Intenta de nuevo.',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      setIsProcessing(false);
      setToast({
        message: 'Error inesperado. Por favor intenta de nuevo.',
        type: 'error',
        isVisible: true
      });
      
      console.error('Error en checkout:', error);
    }
  };

  // Empty state
  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <IoArrowBackOutline className="text-xl" />
          </div>
          <span>Volver a las tiendas</span>
        </Link>

        <section className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm px-6 sm:px-8 py-16 sm:py-20 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-6xl">🛒</div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Tu carrito está vacío
            </h1>
            <p className="text-neutral-500 text-base sm:text-lg">
              Agrega productos desde las tiendas del campus para verlos aquí y
              continuar con tu pedido.
            </p>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 text-white bg-primary font-bold px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Explorar tiendas
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <IoArrowBackOutline className="text-xl" />
          </div>
          <span className="hidden sm:inline">Seguir comprando</span>
          <span className="sm:hidden">Volver</span>
        </Link>

        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <IoCartOutline className="text-3xl text-primary" />
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">
              Tu carrito
            </h1>
          </div>
          <p className="text-neutral-500 text-sm sm:text-base">
            Revisa tus productos antes de confirmar el pedido.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <section className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-neutral-100 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  Productos seleccionados
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  {totalItems} producto{totalItems !== 1 ? "s" : ""} en tu pedido
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {cartItems.map(({ product, quantity }) => (
                <CartItem
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
              <CartSummary
                subtotal={subtotal}
                impuestos={impuestos}
                total={total}
                onCheckout={handleCheckoutClick}
                disabled={hasUnavailableProducts}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={showModal}
        onClose={() => !isProcessing && setShowModal(false)}
        title="Confirmar pedido"
      >
        <div className="space-y-6">
          {/* Resumen */}
          <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Productos</span>
              <span className="font-bold text-neutral-900">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Subtotal</span>
              <span className="font-bold text-neutral-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Impuestos</span>
              <span className="font-bold text-neutral-900">${impuestos.toLocaleString()}</span>
            </div>
            <div className="h-px bg-neutral-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-neutral-900">Total</span>
              <span className="text-2xl font-black text-primary">${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Tiempo estimado */}
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <IoTimeOutline className="text-2xl text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase">Tiempo estimado</p>
              <p className="font-black text-primary text-xl">~{estimatedTime} minutos</p>
            </div>
          </div>

          {/* Info */}
          <p className="text-sm text-neutral-600 text-center">
            Tu pedido será preparado inmediatamente después de confirmar.
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              disabled={isProcessing}
              className="flex-1 bg-neutral-100 text-neutral-700 font-bold py-3 rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmCheckout}
              disabled={isProcessing}
              className="flex-1 bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <IoCheckmarkCircleOutline className="text-xl" />
                  <span>Confirmar pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
};

export default CartPage;