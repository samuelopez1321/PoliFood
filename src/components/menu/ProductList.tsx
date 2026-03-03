import { useState } from "react";
import type { Product } from "../../types";
import ProductCard from "./ProductCard";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "1", name: "Burgers" },
  { id: "2", name: "Drinks" },
];

const products: Product[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Beef patty, lettuce, tomato, cheese",
    price: 8.99,
    imgUrl: "https://via.placeholder.com/300",
    available: true,
    prepTimeMinutes: 10,
    category: "1",
  },
  {
    id: "2",
    name: "Cheese Fries",
    description: "Crispy fries with melted cheese",
    price: 4.5,
    imgUrl: "https://via.placeholder.com/300",
    available: false,
    prepTimeMinutes: 7,
    category: "1",
  },
  {
    id: "3",
    name: "Coca-Cola",
    description: "Refreshing cold drink",
    price: 2.5,
    imgUrl: "https://via.placeholder.com/300",
    available: true,
    prepTimeMinutes: 2,
    category: "2",
  },
];

export const ProductList = () => {
  const [cart, setCart] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    console.log("Producto agregado:", product.name);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-neutral-900 mb-10">
        Campus Burger
      </h1>

      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category.id
        );

        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductList;