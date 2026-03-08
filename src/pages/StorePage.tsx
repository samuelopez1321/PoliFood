import { useParams, Link } from "react-router-dom"; {/*Lo usamos para obtener el id de la tienda y mostrar solo sus productos */}
import type { Product } from "../types";
import { STORES } from '../data/stores';
import ProductList from "../components/menu/ProductList";
import { AiOutlineFastForward } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";

interface StorePageProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export const StorePage = ({ products, onAddToCart }: StorePageProps) => {
    const { storeId } = useParams<{ storeId: string}>(); {/*Siempre devuelve string, hay que pasarlo a number */}
    const storeIdNumero = Number(storeId);
    const store = STORES.find(s => s.storeId === storeIdNumero);
    const storeProducts= products.filter(p => p.storeId === storeIdNumero);

    if (!store) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-neutral-900">Tienda no encontrada</h2>
                <p className="text-neutral-500 mb-6">El ID {storeId} no corresponde a ninguna tienda activa.</p>
                <Link to="/" className="bg-primary text-white px-6 py-2 rounded-full font-bold">
                Volver al Inicio
                </Link>
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
                <span>Volver a las tiendas</span>
            </Link>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h1 className="text-4xl font-black text-neutral-900">{store.name}</h1>
                <p className="text-neutral-500 mt-2">Explora nuestro menú y arma tu pedido.</p>
            </div>
            <ProductList
                products={storeProducts}
                onAddToCart={onAddToCart}
                storeName={`Menú de ${store.name}`}
            />
        </div>
    );
};