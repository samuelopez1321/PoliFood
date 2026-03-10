import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import type { Product } from "../types";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";

interface CartPageProps {
  cart: Product[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
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
  onCheckout,
}: CartPageProps) => {
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
  const tax = 0;
  const total = subtotal + tax;

  const totalItems = cart.length;

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <IoArrowBackOutline className="text-xl" />
          </div>
          <span>Volver a las tiendas</span>
        </Link>

        <section className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm px-8 py-20 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-6xl">🛒</div>
            <h1 className="text-3xl font-black text-neutral-900">
              Tu carrito está vacío
            </h1>
            <p className="text-neutral-500 text-lg">
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
    <div className="max-w-7xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
      >
        <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
          <IoArrowBackOutline className="text-xl" />
        </div>
        <span>Seguir comprando</span>
      </Link>

      <section className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h1 className="text-4xl font-black text-neutral-900">Tu carrito</h1>
        <p className="text-neutral-500 mt-2">
          Revisa tus productos antes de confirmar el pedido.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900">
                Productos seleccionados
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {totalItems} producto{totalItems !== 1 ? "s" : ""} en tu pedido
              </p>
            </div>
          </div>

          <div className="space-y-1">
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

        <aside className="lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={onCheckout}
            />

            <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
              Al continuar, tu pedido será enviado a la tienda correspondiente
              para su preparación.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;