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
      <nav className="bg-storeweb-dark text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 py-2 gap-4">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center hover:outline hover:outline-1 hover:outline-white p-1 rounded">
            <span className="text-2xl font-bold tracking-tight text-white">storeweb</span>
            <span className="text-xs text-sky-400 mb-4 ml-0.5">.clone</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl hidden md:flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-storeweb-primary">
            <button className="bg-gray-100 text-gray-600 px-3 text-xs border-r border-gray-300 hover:bg-gray-200">
              All
            </button>
            <input 
              type="text" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search StoreWeb" 
              className="flex-1 px-3 text-black outline-none"
            />
            <button 
              onClick={handleSearch}
              className="bg-storeweb-primary hover:bg-storeweb-hover text-white px-4 transition-colors"
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
                    <span className="font-bold cursor-pointer hover:text-storeweb-primary" onClick={() => {
                      if (user.role === 'SELLER') navigate('/seller');
                      else if (user.role === 'ADMIN') navigate('/admin');
                      else navigate('/orders');
                    }}>
                      {user.role === 'SELLER' ? 'Seller Dashboard' : user.role === 'ADMIN' ? 'Admin Dashboard' : 'Your Orders'}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="text-xs font-bold hover:text-storeweb-accent flex items-center gap-1">
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
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-storeweb-primary font-bold text-sm">
                  {cartCount}
                </span>
              </div>
              <span className="font-bold hidden md:inline mb-1">Cart</span>
            </Link>
          </div>
        </div>
        
        {/* Sub-nav */}
        <div className="bg-storeweb-light text-gray-100 text-sm px-4 py-1.5 flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 font-bold cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
          >
            <Menu size={18} />
            All
          </div>
          
          <button onClick={() => { setSearchQuery("Best Sellers"); navigate("/"); }} className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors border-none bg-transparent text-gray-100 text-sm">Best Sellers</button>
          <button onClick={() => { setSearchQuery("New Releases"); navigate("/"); }} className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors border-none bg-transparent text-gray-100 text-sm">New Releases</button>
          <Link to="/coming-soon" className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors">StoreWeb TV</Link>
          <button onClick={() => { setSearchQuery("Deals"); navigate("/"); }} className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors border-none bg-transparent text-gray-100 text-sm">Today's Deals</button>
          <Link to="/coming-soon" className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors">Customer Service</Link>
          <button onClick={() => { setSearchQuery("Electronics"); navigate("/"); }} className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors border-none bg-transparent text-gray-100 text-sm">Electronics</button>
          <button onClick={() => { setSearchQuery("Clothing"); navigate("/"); }} className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors border-none bg-transparent text-gray-100 text-sm">Fashion</button>
          <Link to="/coming-soon" className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors">Registry</Link>
          <Link to="/coming-soon" className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors">Gift Cards</Link>
          <Link to="/seller" className="cursor-pointer hover:text-white hover:bg-white/10 p-1 rounded transition-colors">Sell</Link>
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
             <Link to={user ? "#" : "/auth"} onClick={() => !user && setIsSidebarOpen(false)} className="bg-storeweb-dark text-white p-4 pl-8 font-bold text-lg flex items-center gap-3 sticky top-0 z-10 hover:bg-slate-800">
               <UserIcon size={22} className="rounded-full bg-white text-storeweb-dark p-0.5" />
               Hello, {user ? user.name : 'Sign in'}
             </Link>
             
             <div className="py-4 pb-20 text-gray-800 text-sm">
                <div className="font-bold text-lg px-8 py-2 mt-2">Trending</div>
                <ul>
                   <div onClick={() => { setSearchQuery("Best Sellers"); navigate("/"); setIsSidebarOpen(false); }} className="block px-8 py-3 hover:bg-gray-100 cursor-pointer">Best Sellers</div>
                   <div onClick={() => { setSearchQuery("New Releases"); navigate("/"); setIsSidebarOpen(false); }} className="block px-8 py-3 hover:bg-gray-100 cursor-pointer">New Releases</div>
                   <div onClick={() => { setSearchQuery("Movers & Shakers"); navigate("/"); setIsSidebarOpen(false); }} className="block px-8 py-3 hover:bg-gray-100 cursor-pointer">Movers & Shakers</div>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Digital Content & Devices</div>
                <ul>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      StoreWeb TV <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      StoreWeb Music <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                   <div onClick={() => { setSearchQuery("Mobiles"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Mobiles, Computers <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                   <div onClick={() => { setSearchQuery("Kindle"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Kindle E-readers & Books <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      StoreWeb Appstore <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Shop By Department</div>
                <ul>
                   <div onClick={() => { setSearchQuery("Electronics"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Electronics <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                   <div onClick={() => { setSearchQuery("Computers"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Computers <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                   <div onClick={() => { setSearchQuery("Smart Home"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Smart Home <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                   <div onClick={() => { setSearchQuery("Arts & Crafts"); navigate("/"); setIsSidebarOpen(false); }} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Arts & Crafts <ChevronRight size={16} className="text-gray-400"/>
                   </div>
                </ul>
                <hr className="my-2 border-gray-200"/>

                <div className="font-bold text-lg px-8 py-2 mt-2">Programs & Features</div>
                <ul>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Gift Cards <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      Shop By Interest <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      StoreWeb Live <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                   <Link to="/coming-soon" onClick={() => setIsSidebarOpen(false)} className="px-8 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                      International Shopping <ChevronRight size={16} className="text-gray-400"/>
                   </Link>
                </ul>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;