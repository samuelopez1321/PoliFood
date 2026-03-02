import type { CgUnavailable } from 'react-icons/cg';
import type { Product } from '../../types';
import { FaClock } from "react-icons/fa6";
import { Button } from '../../common/UI/Button';

interface ProductCardProps {
    product: Product;
    onAddToCart: (producto: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <div className={`relative flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all hover:shadow-md ${!product.available ? 'grayscale opacity-75' : ''}`}>
            <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                <img src={product.imgUrl} alt={product.name} className="w-full h-full object-cover"/>

                {!product.available && 
                (<span className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                AGOTADO 
                </span>
            )}
            </div>
            <div className='p-4 flex flex-col flex-grow'>
                <div className='flex justify-between items-start mb-2'>
                    <h3 className="font-bold text-neutral-900 leading-tight"> {product.name}</h3>
                    <span className='text-primary font-black text-lg'>${product.price.toLocaleString()}</span>
                </div>
                <p className='text-neutral-800 text-sm line-clamp-2 mb-4'>{product.description}</p>
                <div className='mt-auto pt-3 border-t border-neutral-50 flex justify-between items-center text-xs text-neutral-800'>
                    <span className="flex items-center gap-1">
                        <FaClock /> {product.prepTimeMinutes} min
                    </span>
                    <span className='bg-neutral-100 px-2 py-1 rounded-full uppercase tracking-wider font-semibold'>{product.category}</span>
                </div>
                <Button
                    variant = 'primary'
                    disabled = {!product.available}
                    onClick = {() => onAddToCart(product)}
                    className='mt-4 w-full'
                >
                    {product.available ? 'Agregar al carrito' : 'No disponible'}
                </Button>
            </div>
        </div>
    )
}

export default ProductCard;