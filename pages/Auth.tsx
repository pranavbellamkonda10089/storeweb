import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShieldAlert, Store, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSellerMode, setIsSellerMode] = useState(false); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, registeredUsers } = useStore();
  const navigate = useNavigate();

  const handleBack = () => {
    // Priority 1: If in registration mode, go back to login
    if (!isLogin) {
      setIsLogin(true);
      setError('');
      return;
    }
    
    // Priority 2: If in Admin mode, go back to normal login
    if (isAdminMode) {
      setIsAdminMode(false);
      setError('');
      return;
    }

    // Priority 3: If in Seller mode, go back to normal login
    if (isSellerMode) {
      setIsSellerMode(false);
      setError('');
      return;
    }

    // Priority 4: If in normal login, go to home
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdminMode) {
      const success = login(email, password);
      if (success) {
         navigate('/admin');
      } else {
         setError('Invalid admin credentials');
      }
      return;
    }

    if (isLogin) {
      // Standard Login (Includes Customer and Seller)
      const success = login(email, password);
      if (success) {
        // Determine redirect based on role
        const user = registeredUsers.find(u => u.email === email);
        if (user?.role === 'SELLER') navigate('/seller');
        else if (user?.role === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Registration
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      // Automatically assign role based on current mode
      const roleToRegister = isSellerMode ? 'SELLER' : 'CUSTOMER';
      
      const success = register(name, email, password, roleToRegister);
      if (success) {
        navigate(roleToRegister === 'SELLER' ? '/seller' : '/');
      } else {
        setError('Email already registered.');
      }
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setIsSellerMode(false);
    setIsLogin(true);
    setError('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const toggleSellerMode = () => {
    setIsSellerMode(!isSellerMode);
    setIsAdminMode(false);
    setIsLogin(true);
    setError('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 relative">
       <button 
         onClick={handleBack} 
         className="absolute top-6 left-6 flex items-center gap-1 text-sm text-gray-600 hover:text-amazonia-orange hover:underline bg-transparent border-none cursor-pointer"
       >
          <ArrowLeft size={18} />
          Back
       </button>

       <div className="text-3xl font-bold tracking-tight mb-8">amazonia<span className="text-xs font-normal">.clone</span></div>
       
       <div className="border border-gray-300 rounded p-8 w-full max-w-sm bg-white shadow-sm relative">
         {isAdminMode && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
               <ShieldAlert size={12} /> ADMIN MODE
            </div>
         )}
         {isSellerMode && !isAdminMode && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amazonia-blue text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
               <Store size={12} /> SELLER CENTRAL
            </div>
         )}

         <h1 className="text-3xl font-normal mb-4">
            {isAdminMode ? 'Admin Sign-In' : (isLogin ? (isSellerMode ? 'Seller Sign-In' : 'Sign in') : (isSellerMode ? 'Create Seller Account' : 'Create account'))}
         </h1>
         
         {error && (
           <div className="mb-4 p-3 border border-red-400 bg-red-50 text-red-700 text-sm rounded flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">There was a problem</span>
                <br/>
                {error}
              </div>
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
           {!isLogin && !isAdminMode && (
             <div className="flex flex-col gap-1">
               <label className="text-sm font-bold">Your name</label>
               <input 
                 type="text" 
                 required 
                 value={name} 
                 onChange={e => setName(e.target.value)} 
                 className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:border-amazonia-orange focus:ring-2 focus:ring-violet-200 outline-none transition-colors" 
                 placeholder="First and last name"
               />
             </div>
           )}
           
           <div className="flex flex-col gap-1">
             <label className="text-sm font-bold">Email</label>
             <input 
               type="email" 
               required 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:border-amazonia-orange focus:ring-2 focus:ring-violet-200 outline-none transition-colors" 
               placeholder={isAdminMode ? "admin@amazonia.com" : (isSellerMode ? "seller@example.com" : "")}
             />
           </div>

           <div className="flex flex-col gap-1">
             <label className="text-sm font-bold">Password</label>
             <div className="relative">
               <input 
                 type={showPassword ? "text" : "password"} 
                 required 
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:border-amazonia-orange focus:ring-2 focus:ring-violet-200 outline-none transition-colors pr-10" 
                 placeholder={isAdminMode ? "admin" : "At least 6 characters"}
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
               >
                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
             </div>
           </div>

           <button type="submit" className={`w-full rounded py-1.5 shadow-sm text-sm border mt-2 ${isSellerMode ? 'bg-amazonia-blue text-white hover:bg-amazonia-light border-transparent' : 'bg-amazonia-yellow hover:bg-amazonia-orange border-transparent text-white'}`}>
             {isAdminMode ? 'Login as Admin' : (isLogin ? 'Sign in' : (isSellerMode ? 'Register as Seller' : 'Create your Amazonia account'))}
           </button>
         </form>

         {!isAdminMode && (
           <>
             <div className="mt-8 text-xs text-gray-600">
               By continuing, you agree to Amazonia's Conditions of Use and Privacy Notice.
             </div>

             <div className="relative mt-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative bg-white px-2 text-xs text-gray-500">{isSellerMode ? 'New to Selling?' : 'New to Amazonia?'}</div>
             </div>

             <button 
               onClick={() => {
                 setIsLogin(!isLogin);
                 setError('');
                 setShowPassword(false);
               }}
               className="w-full mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded py-1.5 text-sm shadow-sm"
             >
               {isLogin ? (isSellerMode ? 'Create your Seller account' : 'Create your Amazonia account') : 'Sign in to existing account'}
             </button>
           </>
         )}
         
         <div className="mt-6 pt-6 border-t flex justify-between items-center">
           <button 
             onClick={toggleSellerMode}
             className="text-xs text-amazonia-blue hover:text-orange-700 hover:underline"
           >
             {isSellerMode ? 'Return to Consumer Login' : 'Selling on Amazonia? Login here'}
           </button>
           
           <button 
             onClick={toggleAdminMode}
             className="text-xs text-gray-400 hover:text-gray-600"
           >
             {isAdminMode ? 'Exit Admin' : 'Admin'}
           </button>
         </div>

       </div>
       
       {isAdminMode && (
         <div className="mt-4 text-xs text-gray-500 max-w-sm text-center bg-gray-50 p-2 rounded border">
           <b>Demo Hint:</b> Use <code>admin@amazonia.com</code> / <code>admin</code>
         </div>
       )}
       {isSellerMode && (
         <div className="mt-4 text-xs text-gray-500 max-w-sm text-center bg-gray-50 p-2 rounded border">
           <b>Demo Hint:</b> Use <code>seller@example.com</code> / <code>password</code>
         </div>
       )}
    </div>
  );
};

export default Auth;