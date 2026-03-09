import type { Product } from "../../types";
import { Button } from "../../common/UI/Button";

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItem = ({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  const subtotal = product.price * quantity;

  return (
    <div className="flex items-center justify-between border-b py-4">

      <div className="flex flex-col">
        <h3 className="font-semibold">{product.name}</h3>
        <span className="text-sm text-gray-500">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => onDecrease(product.id)}>
          -
        </Button>

        <span className="px-2 font-medium">
          {quantity}
        </span>

        <Button onClick={() => onIncrease(product.id)}>
          +
        </Button>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-semibold">
          ${subtotal.toFixed(2)}
        </span>

        <button
          className="text-sm text-red-500 hover:underline"
          onClick={() => onRemove(product.id)}
        >
          Remove
        </button>
      </div>

    </div>
  );
};