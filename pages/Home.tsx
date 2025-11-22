import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { filteredProducts, searchQuery } = useStore();

  // If searching, only show matches. If not, show duplicates for fullness
  const productsToRender = searchQuery 
    ? filteredProducts 
    : [...filteredProducts, ...filteredProducts.map(p => ({...p, id: `dup-${p.id}`}))];

  return (
    <div className="max-w-screen-2xl mx-auto bg-gray-100 min-h-screen pb-10">
      {/* Hero Section - Hide on search */}
      {!searchQuery && (
        <div className="relative">
          <div className="absolute w-full h-64 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-10" />
          <div className="h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: 'url("https://picsum.photos/id/20/1500/600")' }}>
            {/* Simple Carousel Placeholder Image */}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={`relative z-20 px-4 ${searchQuery ? 'mt-4' : '-mt-60'}`}>
        {searchQuery && (
          <div className="mb-4 p-2">
            <h2 className="text-xl font-bold">
              {filteredProducts.length > 0 
                ? `Results for "${searchQuery}"` 
                : `No results found for "${searchQuery}"`}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productsToRender.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;