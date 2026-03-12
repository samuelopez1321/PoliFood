import type { Product } from "../../types";
import { IoTrashOutline, IoAddOutline, IoRemoveOutline } from "react-icons/io5";

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
      <div className="w-20 h-20 sm:w-16 sm:h-16 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-neutral-200">
        <img 
          src={product.imgUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-neutral-900 truncate">{product.name}</h3>
        <p className="text-sm text-neutral-500 mt-0.5">
          ${product.price.toLocaleString()} c/u
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 p-1">
          <button
            onClick={() => onDecrease(product.id)}
            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Disminuir cantidad"
          >
            <IoRemoveOutline className="text-lg" />
          </button>

          <span className="min-w-[2rem] text-center font-bold text-neutral-900">
            {quantity}
          </span>

          <button
            onClick={() => onIncrease(product.id)}
            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Aumentar cantidad"
          >
            <IoAddOutline className="text-lg" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-black text-primary text-lg">
              ${subtotal.toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => onRemove(product.id)}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
            aria-label="Eliminar producto"
          >
            <IoTrashOutline className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};