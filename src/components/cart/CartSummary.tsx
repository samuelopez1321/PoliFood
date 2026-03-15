import { IoCardOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

interface CartSummaryProps {
  subtotal: number;
  impuestos?: number;
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export const CartSummary = ({
  subtotal,
  impuestos = 0,
  total,
  onCheckout,
  disabled = false
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

      {disabled && (
        <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-lg">
          <p className="text-accent-dark text-xs font-bold">
            Algunos productos ya no están disponibles. Elimínalos para continuar.
          </p>
        </div>
      )}

       <button
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group ${
          disabled 
            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
            : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
        }`}
      >
        <IoCheckmarkCircleOutline className="text-xl" />
        <span>Finalizar pedido</span>
      </button>
    </div>
  );
};