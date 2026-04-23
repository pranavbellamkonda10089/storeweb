import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, ChevronLeft, Package, Clock, Phone } from 'lucide-react';

const OrderTrackingMap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const order = orders.find(o => o.id === id);
  
  const [progress, setProgress] = useState(0);
  const [showDriver, setShowDriver] = useState(false);

  useEffect(() => {
    // Simulate vehicle movement
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 0.5 : prev));
    }, 100);
    
    const timer = setTimeout(() => setShowDriver(true), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!order) return <div className="p-8 text-center">Order not found</div>;

  // Simulate vehicle position relative to a fake map path
  const vehicleX = 10 + (progress * 0.8);
  const vehicleY = 50 + Math.sin(progress * 0.1) * 20;

  return (
    <div className="max-w-screen-xl mx-auto p-4 min-h-screen bg-gray-50 mt-4">
      <div className="mb-4">
        <Link to="/orders" className="flex items-center gap-1 text-storeweb-accent hover:underline text-sm font-medium">
          <ChevronLeft size={16} /> Back to orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking Map View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative h-[500px]">
             {/* Simulated Map Background */}
             <div className="absolute inset-0 bg-[#e5e3df] opacity-50">
               {/* Randomized road-like lines */}
               <svg className="w-full h-full opacity-40">
                  <path d="M 0 100 Q 250 50 500 150 T 1000 100" stroke="white" strokeWidth="20" fill="none" />
                  <path d="M 100 0 Q 150 250 50 500 T 150 1000" stroke="white" strokeWidth="20" fill="none" />
                  <path d="M 0 300 H 1200" stroke="white" strokeWidth="15" fill="none" />
                  <path d="M 600 0 V 1000" stroke="white" strokeWidth="15" fill="none" />
               </svg>
             </div>

             {/* Map Route Header */}
             <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                <div className="flex-1 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-white flex items-center gap-3">
                   <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <Clock size={20} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase">Estimated Delivery</div>
                      <div className="text-lg font-bold text-gray-800">Today, by 4:00 PM</div>
                   </div>
                </div>
             </div>

             {/* Interactive Map Surface */}
             <div className="absolute inset-0 z-0">
                {/* Destination Marker */}
                <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="bg-red-500 text-white p-2 rounded-full shadow-lg relative z-20"
                   >
                     <MapPin size={24} />
                   </motion.div>
                   <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm mt-1 border border-gray-100">
                      Home (You)
                   </div>
                   <div className="absolute top-1/2 w-4 h-4 bg-red-400/30 rounded-full animate-ping"></div>
                </div>

                {/* Tracking Vehicle */}
                <motion.div 
                  className="absolute z-30"
                  animate={{ 
                    left: `${vehicleX}%`,
                    top: `${vehicleY}%`
                  }}
                  transition={{ type: 'tween', ease: 'linear' }}
                >
                   <div className="relative group cursor-pointer">
                      <div className="bg-storeweb-dark text-white p-2 rounded-lg shadow-xl flex items-center justify-center">
                         <Truck size={24} />
                      </div>
                      {/* Driver Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded shadow-lg border text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                         Carrier on the way
                      </div>
                   </div>
                </motion.div>

                {/* Origin Marker */}
                <div className="absolute left-[5%] top-[60%] flex flex-col items-center opacity-50">
                   <div className="bg-gray-700 text-white p-1 rounded-full">
                      <Package size={16} />
                   </div>
                   <div className="text-[8px] font-bold text-gray-600 mt-1 uppercase tracking-tighter">Warehouse</div>
                </div>
             </div>

             {/* Status Overlay Footer */}
             <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">DP</div>
                      <div>
                         <div className="text-sm font-bold text-gray-800">Dharmesh Poddar</div>
                         <div className="text-xs text-gray-500">Your delivery partner</div>
                      </div>
                   </div>
                   <button className="bg-storeweb-primary hover:bg-storeweb-hover text-white p-3 rounded-full shadow-md transition-all">
                      <Phone size={20} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Tracking Details sidebar */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Tracking Details</h3>
              <div className="space-y-6">
                 {[
                   { status: 'Out for delivery', time: '12:45 PM', active: progress >= 0, desc: 'Package is currently out for delivery.' },
                   { status: 'Arrived at sorting facility', time: '08:20 AM', active: true, desc: 'Your package reached local terminal.' },
                   { status: 'In transit', time: 'Yesterday', active: true, desc: 'Package departed from main hub.' },
                   { status: 'Ordered', time: '2 days ago', active: true, desc: 'We received your order successfully.' }
                 ].map((step, i) => (
                   <div key={i} className="flex gap-4 relative">
                      {i !== 3 && <div className={`absolute left-2 top-5 w-[2px] h-full ${step.active ? 'bg-green-500' : 'bg-gray-200'}`} />}
                      <div className={`w-4 h-4 rounded-full z-10 shrink-0 mt-1 ${step.active ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' : 'bg-gray-200'}`} />
                      <div>
                         <div className={`text-sm font-bold ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>{step.status}</div>
                         <div className="text-xs text-gray-500">{step.time}</div>
                         <div className="text-xs text-gray-400 mt-1">{step.desc}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                 <div className="font-bold text-gray-800">{order.shippingAddress.fullName}</div>
                 <div>{order.shippingAddress.street}</div>
                 <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                 <div>{order.shippingAddress.country}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingMap;
