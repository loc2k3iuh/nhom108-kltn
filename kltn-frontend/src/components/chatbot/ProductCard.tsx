import { Product } from '@/types/chat';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};


const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-md mr-2 flex-shrink-0">
      <Link to={`/product/${product.id}`} className="block">
        <img className="rounded-t-lg w-full h-48 object-cover" src={product.primaryImageUrl} alt={product.name} />
      </Link>
      <div className="p-3">
        <h5 className="text-sm font-semibold tracking-tight text-gray-900 truncate">
            <Link to={`/product/${product.id}`} className="hover:text-blue-600">
             {product.name}
            </Link>
        </h5>
        <div className="flex items-center justify-between mt-2">
          <span className="text-md font-bold text-red-600">{formatPrice(product.discountedPrice)}</span>
        </div>
        {product.basePrice > product.discountedPrice && (
            <span className="text-xs text-gray-500 line-through">{formatPrice(product.basePrice)}</span>
        )}
         <Link to={`/product/${product.id}`} className="mt-2 inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            Xem chi tiết
            <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
