import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import OrderTrackingMap from './pages/OrderTrackingMap';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComingSoon from './pages/ComingSoon';
import Auth from './pages/Auth';
import Invoice from './pages/Invoice';
import Chatbot from './components/Chatbot';
import { StoreProvider } from './context/StoreContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/checkout' || location.pathname.startsWith('/invoice');

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      <Chatbot />
      
      {/* Floating Back to Top Button */}
      {showFloatingButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-storeweb-primary hover:bg-storeweb-hover text-white p-3 rounded-full shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 group"
          aria-label="Back to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:-translate-y-1 transition-transform"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
      )}

      {!isAuthPage && (
        <footer className="bg-storeweb-light text-white text-center mt-auto text-sm">
           <button 
             onClick={scrollToTop}
             className="w-full bg-[#37475a] hover:bg-[#485769] py-4 text-white font-medium transition-colors text-sm cursor-pointer"
           >
             Back to top
           </button>
           
           <div className="py-8 max-w-screen-lg mx-auto">
             <div className="grid grid-cols-4 gap-8 text-left text-gray-300 mb-8 px-4">
               <div>
                 <h3 className="font-bold text-white mb-2">Get to Know Us</h3>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">Careers</Link>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">Blog</Link>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">About StoreWeb</Link>
               </div>
               <div>
                 <h3 className="font-bold text-white mb-2">Make Money with Us</h3>
                 <Link to="/seller" className="block cursor-pointer hover:underline">Sell products on StoreWeb</Link>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">Sell on StoreWeb Business</Link>
               </div>
               <div>
                 <h3 className="font-bold text-white mb-2">StoreWeb Payment</h3>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">StoreWeb Business Card</Link>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">Shop with Points</Link>
               </div>
               <div>
                 <h3 className="font-bold text-white mb-2">Let Us Help You</h3>
                 <Link to="/coming-soon" className="block cursor-pointer hover:underline">StoreWeb and COVID-19</Link>
                 <Link to="/auth" className="block cursor-pointer hover:underline">Your Account</Link>
                 <Link to="/orders" className="block cursor-pointer hover:underline">Your Orders</Link>
               </div>
             </div>
             <div className="border-t border-gray-600 pt-4 mx-4">
                © 1996-2023, StoreWeb.com, Inc. or its affiliates
             </div>
           </div>
        </footer>
      )}
    </>
  );
}

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderTracking />} />
            <Route path="/track/:id" element={<OrderTrackingMap />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
};

export default App;