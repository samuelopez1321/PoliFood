import type { Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  storeName?: string;
}

export const ProductList = ({ products, onAddToCart, storeName = "Menú Principal" }: ProductListProps) => {
  
  // Sacar las categorías de los productos
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12 border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">
          {storeName}
        </h1>
        <p className="text-neutral-800 text-sm">
          Selecciona tus productos favoritos y recíbelos en el campus.
        </p>
      </header>
      {/* Mapeo por categorías  */}
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category
        );

        return (
          <section key={category} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-extrabold text-neutral-800 whitespace-nowrap">
                {category}
              </h2>
              <div className="h-[2px] w-full bg-neutral-100"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id} // Usamos productId según la estructura de datos 
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* si no hay productos disponibles */}
      {products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-neutral-100">
          <p className="text-neutral-800 font-medium">No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;