import type { CgUnavailable } from 'react-icons/cg';
import type { Product } from '../../types';
import { FaClock } from "react-icons/fa6";

interface ProductCardProps {
    product: Product;
    onAddToCart: (producto: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <div className={'product-card ${!producto.available ? "unavailable" : ""}'}>
            <div className='product-image'>
                <img src="{product.image}" alt="{product.name}" />
                {!product.available && <span className='status-badge'>Agotado</span>}
            </div>
            <div className='product-info'>
                <div className='product-header'>
                    <h3>{product.name}</h3>
                    <span className='product-price'>${product.price.toLocaleString()}</span>
                </div>
                <p className='product-description'>{product.description}</p>
                <div className='product-footer'>
                    <span className="prep-time">
                        <FaClock /> {product.prepTimeMinutes} min
                    </span>
                    <span className='product-category'>{product.category}</span>
                </div>
                <button
                    className='add-button'
                    disabled={!product.available}
                    onClick={() => onAddToCart?.(product)}>
                    {product.available ? 'Agregar al carrito' : 'No disponible'}
                </button>
            </div>
        </div>
    )
}

export default ProductCard;