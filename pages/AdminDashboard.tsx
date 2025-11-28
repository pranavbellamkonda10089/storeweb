import React from 'react';
import { useStore } from '../context/StoreContext';
import { User, Order } from '../types';
import { Users, ShoppingBag, Shield, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, registeredUsers, orders } = useStore();
  const navigate = useNavigate();

  // Security check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-xl font-bold text-red-600 mb-4">Access Denied</div>
        <p className="mb-4">You must be an administrator to view this page.</p>
        <button onClick={() => navigate('/auth')} className="text-storeweb-accent hover:underline">Go to Login</button>
      </div>
    );
  }

  const getOrdersForUser = (userId: string): Order[] => {
    return orders.filter(o => o.userId === userId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
             <Shield className="text-storeweb-accent" /> Admin Dashboard
           </h1>
           <div className="text-sm text-gray-600">
             Logged in as: <b>{user.name}</b>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-lg shadow border-t-4 border-storeweb-primary">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-sky-100 text-storeweb-primary rounded-full"><Users size={24} /></div>
                 <div>
                   <div className="text-gray-500 text-sm">Total Users</div>
                   <div className="text-2xl font-bold">{registeredUsers.length}</div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-600">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 text-green-600 rounded-full"><ShoppingBag size={24} /></div>
                 <div>
                   <div className="text-gray-500 text-sm">Total Orders</div>
                   <div className="text-2xl font-bold">{orders.length}</div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-lg shadow border-t-4 border-storeweb-accent">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-rose-100 text-storeweb-accent rounded-full"><Shield size={24} /></div>
                 <div>
                   <div className="text-gray-500 text-sm">Total Revenue</div>
                   <div className="text-2xl font-bold">₹{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Registered Users & Orders</h2>
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                 <Key size={12}/> WARNING: Passwords displayed for demo purposes only.
              </p>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                   <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-red-600">Password</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Orders</th>
                      <th className="px-6 py-3">Last Order Date</th>
                   </tr>
                </thead>
                <tbody>
                   {registeredUsers.map((u) => {
                     const userOrders = getOrdersForUser(u.id);
                     const lastOrder = userOrders.length > 0 ? userOrders[0] : null;
                     
                     return (
                       <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                   {u.name.charAt(0).toUpperCase()}
                                </div>
                                {u.name}
                             </div>
                          </td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4 font-mono text-red-600">{u.password}</td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                u.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                u.role === 'SELLER' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                                'bg-green-50 text-green-700 border-green-200'
                             }`}>
                                {u.role}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="font-bold">{userOrders.length}</span>
                             {userOrders.length > 0 && (
                               <div className="text-xs text-gray-400 mt-1">
                                  Total: ₹{userOrders.reduce((a, b) => a + b.total, 0).toFixed(2)}
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4">
                             {lastOrder ? new Date(lastOrder.date).toLocaleDateString() : '-'}
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;