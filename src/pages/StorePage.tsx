import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import type { Product, Store } from "../types";
import ProductList from "../components/menu/ProductList";
import { IoArrowBackOutline } from "react-icons/io5";
import { apiGetProductsByStore, apiGetStoreById } from '../services/services';

interface StorePageProps {
  onAddToCart: (product: Product) => void;
}

export const StorePage = ({ onAddToCart }: StorePageProps) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<Store | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    Promise.all([
      apiGetStoreById(storeId),
      apiGetProductsByStore(storeId),
    ]).then(([storeRes, productsRes]) => {
      if (storeRes.success && storeRes.data) setStoreData(storeRes.data);
      if (productsRes.success && productsRes.data) setProducts(productsRes.data);
      setLoading(false);
    });
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-900">Tienda no encontrada</h2>
        <Link to="/" className="bg-primary text-white px-6 py-2 rounded-full font-bold mt-4 inline-block">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors font-medium group">
        <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
          <IoArrowBackOutline className="text-xl" />
        </div>
        <span>Volver a las tiendas</span>
      </Link>
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h1 className="text-4xl font-black text-neutral-900">{storeData.nombre}</h1>
        <p className="text-neutral-500 mt-2">Explora nuestro menú y arma tu pedido.</p>
      </div>
      <ProductList
        products={products}
        onAddToCart={onAddToCart}
        storeName={`Menú de ${storeData.nombre}`}
      />
    </div>
  );
};
