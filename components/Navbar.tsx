import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User as UserIcon, LogOut, X, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const { cart, user, logout, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    setSearchQuery(localSearch);
    navigate('/');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogoClick = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  return (
    <>
      <nav className="bg-amazonia-dark text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2 gap-4">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center hover:outline hover:outline-1 hover:outline-white p-1 rounded">
            <span className="text-2xl font-bold tracking-tight">amazonia</span>
            <span className="text-xs text-white mb-4 ml-0.5">.clone</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl hidden md:flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazonia-orange">
            <button className="bg-gray-100 text-gray-600 px-3 text-xs border-r border-gray-300 hover:bg-gray-200">
              All
            </button>
            <input 
              type="text" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Amazonia" 
              className="flex-1 px-3 text-black outline-none"
            />
            <button 
              onClick={handleSearch}
              className="bg-amazonia-yellow hover:bg-amazonia-orange text-amazonia-dark px-4"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 text-sm">
            {user ? (
               <div className="flex items-center gap-4">
                  <div className="flex flex-col leading-none text-xs">
                    <span className="text-gray-300">Hello, {user.name}</span>
                    <span className="font-bold cursor-pointer hover:underline" onClick={() => {
                      if (user.role === 'SELLER') navigate('/seller');
                      else if (user.role === 'ADMIN') navigate('/admin');
                      else navigate('/orders');
                    }}>
                      {user.role === 'SELLER' ? 'Seller Dashboard' : user.role === 'ADMIN' ? 'Admin Dashboard' : 'Your Orders'}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="text-xs font-bold hover:text-amazonia-orange flex items-center gap-1">
                     Sign Out
                  </button>
               </div>
            ) : (
              <Link to="/auth" className="flex flex-col leading-none hover:outline hover:outline-1 hover:outline-white p-1 rounded">
                <span className="text-xs text-gray-300">Hello, sign in</span>
                <span className="font-bold">Account & Lists</span>
              </Link>
            )}

            <Link to="/orders" className="flex flex-col leading-none hover:outline hover:outline-1 hover:outline-white p-1 rounded">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="font-bold">& Orders</span>
            </Link>

            <Link to="/cart" className="flex items-end hover:outline hover:outline-1 hover:outline-white p-1 rounded relative">
              <div className="relative">
                <ShoppingCart size={32} />
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amazonia-orange font-bold text-sm">
                  {cartCount}
                </span>
              </div>
              <span className="font-bold hidden md:inline mb-1">Cart</span>
            </Link>
          </div>
        </div>
        
        {/* Sub-nav */}
        <div className="bg-amazonia-light text-white text-sm px-4 py-1.5 flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 font-bold cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded"
          >
            <Menu size={18} />
            All
          </div>
          
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Best Sellers</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">New Releases</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Amazonia TV</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Today's Deals</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Customer Service</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Books</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Fashion</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Registry</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Gift Cards</span>
          <span className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1 rounded">Sell</span>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          
          {/* Close Button (External) */}
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 left-[330px] text-white z-[70]">
             <X size={30} />
          </button>

          {/* Sidebar Content */}
          <div className="relative w-[320px] bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300">
             <div className="bg-amazonia-light text-white p-4 pl-8 font-bold text-lg flex items-center gap-3 sticky top-0 z-10">
               <UserIcon size={22} className="rounded-full bg-white text-amazonia-light p-0.5" />
               Hello, {user ? user.name : 'Sign in'}
             </div>
             
             <div className="py-4 pb-20 text-gray-800 text-sm">
                <div className="font-bold text-lg px-8 py-2 mt-2">Trending</div>
                <ul>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer">Best Sellers</li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer">New Releases</li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer">Movers & Shakers</li>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Digital Content & Devices</div>
                <ul>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Amazonia TV <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Amazonia Music <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Mobiles, Computers <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Kindle E-readers & Books <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Amazonia Appstore <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Shop By Department</div>
                <ul>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Electronics <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Computers <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Smart Home <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Arts & Crafts <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Programs & Features</div>
                <ul>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Gift Cards <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Shop By Interest <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Amazonia Live <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                   <li className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      International Shopping <ChevronRight size={16} className="text-gray-400"/>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;