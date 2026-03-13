import { IoCardOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

interface CartSummaryProps {
  subtotal: number;
  impuestos?: number;
  total: number;
  onCheckout: () => void;
}

export const CartSummary = ({
  subtotal,
  impuestos = 0,
  total,
  onCheckout,
}: CartSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-neutral-900">
        <IoCardOutline className="text-2xl text-primary" />
        <h2 className="text-xl font-black">Resumen del pedido</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-neutral-700">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="font-bold">${subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-neutral-700">
          <span className="text-sm font-medium">Impuestos</span>
          <span className="font-bold">${impuestos.toLocaleString()}</span>
        </div>

        <div className="h-px bg-neutral-200"></div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-black text-neutral-900">Total</span>
          <span className="text-2xl font-black text-primary">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
      >
        <IoCheckmarkCircleOutline className="text-xl" />
        <span>Finalizar pedido</span>
      </button>
      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
        <p className="text-xs text-neutral-600 text-center">
          Al confirmar tu pedido, recibirás un código de seguimiento para rastrear tu entrega en el campus.
        </p>
      </div>
    </div>
  );
};