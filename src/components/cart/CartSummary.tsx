import { Button } from "../../common/UI/Button";

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
    <div className="border rounded-lg p-4 flex flex-col gap-3">

      <h2 className="text-lg font-semibold">
        Resumen de Orden
      </h2>

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Impuestos</span>
        <span>${impuestos.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-semibold text-lg border-t pt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Button onClick={onCheckout}>
        Checkout
      </Button>

    </div>
  );
};