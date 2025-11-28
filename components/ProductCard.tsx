
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine main image and additional images into one array
  const allImages = [product.image, ...(product.images || [])];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm hover:shadow-lg transition-shadow flex flex-col h-full group relative">
      <Link to={`/product/${product.id}`} className="flex-1 flex justify-center items-center bg-gray-50 mb-4 p-4 h-48 relative">
        
        {/* Main Image */}
        <img 
          src={allImages[currentImageIndex]} 
          alt={product.title} 
          className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
        />

        {/* Carousel Buttons - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-r shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-l shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {allImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-storeweb-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
      </Link>
      
      <div className="flex flex-col gap-1">
        <Link to={`/product/${product.id}`} className="hover:text-storeweb-accent hover:underline line-clamp-2 text-sm font-medium text-gray-900">
          {product.title}
        </Link>
        
        <div className="flex items-center gap-1 text-sm text-yellow-400">
           <div className="flex">
             {[...Array(5)].map((_, i) => (
               <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating) ? 0 : 2} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
             ))}
           </div>
           <span className="text-storeweb-accent text-xs hover:underline cursor-pointer">{product.reviewCount}</span>
        </div>

        <div className="mt-1">
          <span className="text-xs align-top">₹</span>
          <span className="text-xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xs align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
        </div>

        {product.isPrime && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-storeweb-primary font-bold italic">prime</span>
            <span>FREE delivery</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
