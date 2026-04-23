import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock, CheckCircle, CreditCard } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=checkout');
    }
  }, [user, navigate]);
  
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

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.zip) {
      alert("Please fill in your shipping address");
      return;
    }
    if (payment.cardNumber.length < 16 || !payment.expiry || payment.cvv.length < 3) {
      alert("Please enter valid payment details");
      return;
    }
    setLoading(true);
    // Simulate payment authorization
    await new Promise(resolve => setTimeout(resolve, 2000));
    await placeOrder(address);
    setLoading(false);
    setOrderComplete(true);
    
    // Final delay to show success state
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
           <p className="text-gray-600 mb-8">Your order has been placed and is being processed.</p>
           <div className="flex items-center justify-center gap-2 text-storeweb-accent animate-pulse">
              <span>Redirecting to your orders...</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b p-4 flex items-center justify-between">
         <div className="text-2xl font-bold tracking-tight text-black">storeweb<span className="text-xs font-normal text-sky-500">.clone</span> <span className="text-gray-500 font-normal text-xl text-black">Checkout</span></div>
         <Lock size={20} className="text-gray-500" />
      </div>

      <div className="max-w-screen-lg mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white border-b pb-4">
            <h2 className="text-lg font-bold text-storeweb-primary mb-4">1 Shipping address</h2>
            <div className="space-y-3 max-w-md">
              <div className="space-y-1">
                <label className="text-sm font-bold">Full name</label>
                <input type="text" className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold">Address</label>
                <input type="text" placeholder="Street address" className="w-full border rounded p-1.5 mb-2 focus:ring-1 ring-sky-500 outline-none" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1">
                    <label className="text-sm font-bold">City</label>
                    <input type="text" className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" value={address.city} onChange={e => setAddress({...address, city: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold">State</label>
                    <input type="text" className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" value={address.state} onChange={e => setAddress({...address, state: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold">Zip</label>
                    <input type="text" className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})}/>
                 </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border-b pb-4">
            <h2 className="text-lg font-bold text-storeweb-primary mb-4">2 Payment method</h2>
            <div className="border rounded-md p-4 bg-gray-50">
               <div className="flex items-center gap-2 mb-4">
                  <input type="radio" checked readOnly className="text-sky-600" />
                  <span className="font-bold flex items-center gap-2">
                    <CreditCard size={18} />
                    Credit or Debit Card
                  </span>
               </div>
               <div className="ml-6 space-y-3 max-w-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Card number</label>
                    <input 
                      type="text" 
                      maxLength={16}
                      placeholder="0000 0000 0000 0000" 
                      className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none font-mono" 
                      value={payment.cardNumber}
                      onChange={e => setPayment({...payment, cardNumber: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-gray-600">Expiration (MM/YY)</label>
                        <input 
                          type="text" 
                          maxLength={5}
                          placeholder="MM/YY" 
                          className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" 
                          value={payment.expiry}
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
                            setPayment({...payment, expiry: val});
                          }}
                        />
                     </div>
                     <div className="w-1/3 space-y-1">
                        <label className="text-xs font-bold text-gray-600">CVV</label>
                        <input 
                          type="password" 
                          maxLength={3}
                          placeholder="000" 
                          className="w-full border rounded p-1.5 focus:ring-1 ring-sky-500 outline-none" 
                          value={payment.cvv}
                          onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g, '')})}
                        />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Review Items */}
          <div className="bg-white">
            <h2 className="text-lg font-bold text-storeweb-primary mb-4">3 Review items and shipping</h2>
            <div className="border rounded p-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 mb-4">
                   {item.image && <img src={item.image} className="w-16 h-16 object-contain" alt={item.title} />}
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
                className="w-full bg-storeweb-primary hover:bg-storeweb-hover text-white rounded-md py-2 text-sm shadow-sm mb-4 disabled:opacity-50 transition-colors"
             >
               {loading ? (
                 <div className="flex items-center justify-center gap-2 leading-none">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Securing Payment...</span>
                 </div>
               ) : 'Place your order'}
             </button>
             <p className="text-xs text-center text-gray-500 mb-4 px-2">
               By placing your order, you agree to StoreWeb Clone's fake privacy notice and conditions of use.
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