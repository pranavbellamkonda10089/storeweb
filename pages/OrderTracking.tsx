import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';

const OrderTracking: React.FC = () => {
  const { orders, user } = useStore();
  const myOrders = orders.filter(o => o.userId === user?.id);

  if (!user) return <div className="p-8">Please login</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-4 bg-white mt-4 min-h-screen">
       <h1 className="text-2xl font-normal mb-6">Your Orders</h1>
       
       <div className="flex gap-4 text-sm border-b mb-4">
          <span className="font-bold border-b-2 border-storeweb-primary pb-2 text-black cursor-pointer">Orders</span>
          <span className="text-storeweb-accent cursor-pointer">Buy Again</span>
          <span className="text-storeweb-accent cursor-pointer">Not Yet Shipped</span>
          <span className="text-storeweb-accent cursor-pointer">Cancelled Orders</span>
       </div>

       <div className="space-y-6">
         {myOrders.length === 0 ? <p>No orders placed yet.</p> : myOrders.map(order => (
           <div key={order.id} className="border rounded-md">
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-xs md:text-sm text-gray-600 border-b gap-4">
                 <div className="flex gap-8">
                    <div>
                       <div className="uppercase">Order Placed</div>
                       <div className="text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                       <div className="uppercase">Total</div>
                       <div className="text-gray-900">₹{order.total.toFixed(2)}</div>
                    </div>
                    <div>
                       <div className="uppercase">Ship To</div>
                       <div className="text-storeweb-accent hover:underline cursor-pointer">{user.name}</div>
                    </div>
                 </div>
                 <div>
                    <div className="uppercase">Order # {order.id}</div>
                    <div className="flex gap-2 text-storeweb-accent">
                      <span className="hover:underline cursor-pointer">View order details</span> 
                      <span className="text-gray-400">|</span> 
                      <Link to={`/invoice/${order.id}`} className="hover:underline cursor-pointer">Invoice</Link>
                    </div>
                 </div>
              </div>
              
              {/* Order Body */}
              <div className="p-4">
                 <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    {order.status === OrderStatus.DELIVERED ? <CheckCircle className="text-green-600" /> : <Truck className="text-storeweb-primary" />}
                    {order.status}
                 </h3>
                 
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 max-w-lg">
                    <div className={`bg-storeweb-primary h-2.5 rounded-full transition-all duration-500`} style={{
                      width: order.status === OrderStatus.PENDING ? '10%' : 
                             order.status === OrderStatus.PROCESSING ? '30%' :
                             order.status === OrderStatus.SHIPPED ? '60%' : '100%'
                    }}></div>
                 </div>

                 <div className="space-y-4">
                   {order.items.map(item => (
                     <div key={item.id} className="flex gap-4">
                        {item.image && <img src={item.image} className="w-20 h-20 object-contain" alt={item.title} />}
                        <div>
                           <div className="font-bold text-storeweb-accent hover:underline text-sm">{item.title}</div>
                           <div className="text-xs text-gray-500">Return window closed on Nov 20, 2023</div>
                           <button className="mt-2 bg-storeweb-primary hover:bg-storeweb-hover text-white px-3 py-1 rounded-md text-xs shadow-sm transition-colors">Buy it again</button>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default OrderTracking;