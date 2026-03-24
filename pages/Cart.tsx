import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2 } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, user } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
       <div className="max-w-screen-xl mx-auto p-8 bg-white mt-4 shadow-sm min-h-[400px]">
         <h1 className="text-2xl font-medium mb-4">Your StoreWeb Cart is empty.</h1>
         <Link to="/" className="text-storeweb-accent hover:underline hover:text-storeweb-primary">Continue shopping</Link>
       </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 mt-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Cart Items */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-medium border-b pb-2 mb-4">Shopping Cart</h1>
          <div className="flex justify-end text-sm text-gray-500 mb-2">Price</div>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <Link to={`/product/${item.id}`}>
                  {item.image && <img src={item.image} alt={item.title} className="w-40 h-40 object-contain" />}
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="text-lg font-medium text-storeweb-accent hover:underline line-clamp-2">
                    {item.title}
                  </Link>
                  <div className="text-green-700 text-xs mt-1">In Stock</div>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-xs text-storeweb-primary font-bold italic">prime</span>
                    <span className="text-xs text-gray-500">FREE Delivery</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-2 bg-gray-50 border rounded-md shadow-sm px-2 py-1">
                      <span>Qty:</span>
                      <select 
                        value={item.quantity} 
                        onChange={(e) => updateCartQuantity(item.id, Number(e.target.value))}
                        className="bg-transparent outline-none"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-storeweb-accent hover:underline text-xs">Delete</button>
                    <button className="text-storeweb-accent hover:underline text-xs">Save for later</button>
                  </div>
                </div>
                <div className="text-right font-bold text-lg">
                  ₹{item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-right text-lg mt-4">
            Subtotal ({totalItems} items): <span className="font-bold">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="w-full lg:w-80 h-fit bg-white p-4 shadow-sm">
           <div className="text-lg mb-4">
             Subtotal ({totalItems} items): <span className="font-bold">₹{subtotal.toFixed(2)}</span>
           </div>
           <button 
             onClick={handleCheckout}
             className="w-full bg-storeweb-primary hover:bg-storeweb-hover text-white rounded-md py-2 shadow-sm text-sm transition-colors"
           >
             Proceed to checkout
           </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;