import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Star } from 'lucide-react';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="flex-1 flex justify-center items-center bg-gray-50 mb-4 p-4 h-48">
        <img src={product.image} alt={product.title} className="max-h-full object-contain mix-blend-multiply" />
      </Link>
      
      <div className="flex flex-col gap-1">
        <Link to={`/product/${product.id}`} className="hover:text-amazonia-blue hover:underline line-clamp-2 text-sm font-medium">
          {product.title}
        </Link>
        
        <div className="flex items-center gap-1 text-sm text-yellow-400">
           <div className="flex">
             {[...Array(5)].map((_, i) => (
               <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating) ? 0 : 2} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
             ))}
           </div>
           <span className="text-amazonia-blue text-xs hover:underline cursor-pointer">{product.reviewCount}</span>
        </div>

        <div className="mt-1">
          <span className="text-xs align-top">₹</span>
          <span className="text-xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xs align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
        </div>

        {product.isPrime && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-amazonia-blue font-bold italic">prime</span>
            <span>FREE delivery</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;