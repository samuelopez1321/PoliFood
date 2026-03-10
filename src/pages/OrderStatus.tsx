import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoCheckmarkCircle, IoReceiptOutline, IoStorefrontOutline, IoTimeOutline } from "react-icons/io5";
import { ORDERS } from "../data/orders";
import { PRODUCTS } from "../data/products";
import { STORES } from "../data/stores";

const STATUS_STEPS = ["RECIBIDO", "PREPARANDO", "EN CAMINO", "ENVIADO"] as const;

const statusStyles: Record<string, string> = {
  RECIBIDO: "bg-blue-100 text-blue-700",
  PREPARANDO: "bg-amber-100 text-amber-700",
  "EN CAMINO": "bg-violet-100 text-violet-700",
  ENVIADO: "bg-green-100 text-green-700",
};

const formatPrice = (value: number) => {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const OrderStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const order = orderId
    ? ORDERS.find((currentOrder) => currentOrder.id === Number(orderId))
    : ORDERS[0];

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <IoArrowBackOutline className="text-xl" />
          </div>
          <span>Volver al inicio</span>
        </Link>

        <section className="bg-white rounded-3xl border-2 border-dashed border-neutral-100 shadow-sm px-8 py-20 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-6xl">📦</div>
            <h1 className="text-3xl font-black text-neutral-900">
              Pedido no encontrado
            </h1>
            <p className="text-neutral-500 text-lg">
              No encontramos un pedido con ese identificador.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const store = STORES.find((currentStore) => currentStore.storeId === order.storeId);

  const orderProducts = order.items.map((item) => {
    const product = PRODUCTS.find((currentProduct) => currentProduct.id === item.productId);

    return {
      ...item,
      product,
      subtotal: (product?.price ?? 0) * item.quantity,
    };
  });

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group"
      >
        <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
          <IoArrowBackOutline className="text-xl" />
        </div>
        <span>Volver al inicio</span>
      </Link>

      <section className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Seguimiento de pedido
            </p>
            <h1 className="text-4xl font-black text-neutral-900 mt-2">
              Pedido #{order.id}
            </h1>
            <p className="text-neutral-500 mt-2">
              Revisa el estado actual de tu orden y el tiempo estimado de entrega.
            </p>
          </div>

          <span
            className={`inline-flex items-center self-start px-4 py-2 rounded-full text-sm font-bold ${
              statusStyles[order.status] ?? "bg-neutral-100 text-neutral-700"
            }`}
          >
            {order.status}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IoCheckmarkCircle className="text-2xl text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">
                  Estado del pedido
                </h2>
                <p className="text-sm text-neutral-500">
                  Sigue el avance de tu orden en tiempo real.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? "border-primary/20 bg-primary/5"
                        : "border-neutral-100 bg-neutral-50"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-3 ${
                        isCompleted
                          ? "bg-primary text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`font-bold ${
                        isCurrent ? "text-primary" : "text-neutral-800"
                      }`}
                    >
                      {step}
                    </p>

                    <p className="text-xs text-neutral-500 mt-1">
                      {isCompleted ? "Etapa alcanzada" : "Pendiente por completar"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IoReceiptOutline className="text-2xl text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">
                  Productos del pedido
                </h2>
                <p className="text-sm text-neutral-500">
                  Resumen de los productos incluidos en esta orden.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orderProducts.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      {item.product?.name ?? "Producto no disponible"}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Cantidad: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-neutral-900">
                      {formatPrice(item.subtotal)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatPrice(item.product?.price ?? 0)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-5">
              Resumen de la orden
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IoStorefrontOutline className="text-xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Tienda</p>
                  <p className="font-bold text-neutral-900">
                    {store?.name ?? "Tienda no disponible"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IoTimeOutline className="text-xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Tiempo estimado</p>
                  <p className="font-bold text-neutral-900">
                    {order.etaMinutes} min
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-4">
                <p className="text-sm text-neutral-500">Creado</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-black text-neutral-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              ¿Quieres seguir comprando?
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              Puedes volver al inicio y explorar otras tiendas del campus.
            </p>

            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 text-white bg-primary font-bold px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Explorar tiendas
              <span className="text-xl">→</span>
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderStatus;