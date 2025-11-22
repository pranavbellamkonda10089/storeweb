import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const handlePlaceOrder = async () => {
    setLoading(true);
    await placeOrder(address);
    setLoading(false);
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b p-4 flex items-center justify-between">
         <div className="text-2xl font-bold tracking-tight text-black">amazonia<span className="text-xs font-normal">.clone</span> <span className="text-gray-500 font-normal text-xl">Checkout</span></div>
         <Lock size={20} className="text-gray-500" />
      </div>

      <div className="max-w-screen-lg mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white border-b pb-4">
            <h2 className="text-lg font-bold text-amazonia-orange mb-4">1 Shipping address</h2>
            <div className="space-y-3 max-w-md">
              <div className="space-y-1">
                <label className="text-sm font-bold">Full name</label>
                <input type="text" className="w-full border rounded p-1.5 focus:ring-1 ring-orange-500 outline-none" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold">Address</label>
                <input type="text" placeholder="Street address" className="w-full border rounded p-1.5 mb-2" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1">
                    <label className="text-sm font-bold">City</label>
                    <input type="text" className="w-full border rounded p-1.5" value={address.city} onChange={e => setAddress({...address, city: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold">State</label>
                    <input type="text" className="w-full border rounded p-1.5" value={address.state} onChange={e => setAddress({...address, state: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold">Zip</label>
                    <input type="text" className="w-full border rounded p-1.5" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})}/>
                 </div>
              </div>
            </div>
          </div>

          {/* Payment Section (Dummy) */}
          <div className="bg-white border-b pb-4">
            <h2 className="text-lg font-bold text-amazonia-orange mb-4">2 Payment method</h2>
            <div className="border rounded-md p-4 bg-gray-50">
               <div className="flex items-center gap-2 mb-2">
                  <input type="radio" checked readOnly className="text-orange-600" />
                  <span className="font-bold">Credit or Debit Card</span>
               </div>
               <div className="ml-6 space-y-2 max-w-xs">
                  <input type="text" placeholder="Card number (Dummy)" className="w-full border rounded p-1.5" disabled />
                  <div className="flex gap-2">
                     <input type="text" placeholder="MM/YY" className="w-1/2 border rounded p-1.5" disabled/>
                     <input type="text" placeholder="CVC" className="w-1/2 border rounded p-1.5" disabled/>
                  </div>
               </div>
            </div>
          </div>

          {/* Review Items */}
          <div className="bg-white">
            <h2 className="text-lg font-bold text-amazonia-orange mb-4">3 Review items and shipping</h2>
            <div className="border rounded p-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 mb-4">
                   <img src={item.image} className="w-16 h-16 object-contain" />
                   <div>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-sm text-red-700 font-bold">₹{item.price.toFixed(2)}</div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Order Summary */}
        <div className="md:col-span-1">
           <div className="bg-white border rounded-md p-4 sticky top-4">
             <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-amazonia-yellow hover:bg-amazonia-orange rounded-md py-2 text-sm shadow-sm mb-4 disabled:opacity-50"
             >
               {loading ? 'Processing...' : 'Place your order'}
             </button>
             <p className="text-xs text-center text-gray-500 mb-4 px-2">
               By placing your order, you agree to Amazonia Clone's fake privacy notice and conditions of use.
             </p>
             <div className="border-t pt-4 space-y-1 text-sm text-gray-700">
               <div className="flex justify-between"><span>Items:</span> <span>₹{subtotal.toFixed(2)}</span></div>
               <div className="flex justify-between"><span>Shipping:</span> <span>₹0.00</span></div>
               <div className="flex justify-between"><span>Total before tax:</span> <span>₹{subtotal.toFixed(2)}</span></div>
               <div className="flex justify-between"><span>Tax:</span> <span>₹{tax.toFixed(2)}</span></div>
               <div className="flex justify-between font-bold text-lg text-red-800 border-t mt-2 pt-2"><span>Order Total:</span> <span>₹{total.toFixed(2)}</span></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;