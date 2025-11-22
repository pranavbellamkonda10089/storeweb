import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, Product } from '../types';
import { Package, PlusCircle, Settings, Upload, FileText, UserCheck, MapPin, CreditCard, CheckCircle } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const { orders, updateOrderStatus, user, addProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'add_product' | 'profile'>('orders');

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Electronics',
    image: '',
    isPrime: false
  });

  // Profile Form State
  const [sellerProfile, setSellerProfile] = useState({
    businessName: 'My Amazing Store',
    street: '',
    city: '',
    taxId: '',
    accountHolder: '',
    accountNumber: '',
    ifsc: ''
  });

  const [docsUploaded, setDocsUploaded] = useState({
    id: false,
    license: false
  });

  if (user?.role !== 'SELLER') return <div className="p-8 text-center text-xl text-red-600 font-bold">Access Denied. Seller Account Required.</div>;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      image: newProduct.image || `https://picsum.photos/seed/${Math.random()}/400/400`,
      rating: 0,
      reviewCount: 0,
      isPrime: newProduct.isPrime
    };
    addProduct(product);
    setNewProduct({ title: '', price: '', description: '', category: 'Electronics', image: '', isPrime: false });
    alert('Product added successfully!');
    setActiveTab('orders'); // Return to dashboard
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Seller Profile, Bank Details & Documents saved successfully!');
  };

  const simulateUpload = (doc: 'id' | 'license') => {
    setTimeout(() => {
      setDocsUploaded(prev => ({ ...prev, [doc]: true }));
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b border-gray-100">
           <h1 className="text-xl font-bold text-amazonia-dark">Seller Central</h1>
           <p className="text-xs text-gray-500">Welcome, {user.name}</p>
        </div>
        <nav className="p-4 space-y-1">
           <button 
             onClick={() => setActiveTab('orders')}
             className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-amazonia-blue' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <Package size={18} /> Manage Orders
           </button>
           <button 
             onClick={() => setActiveTab('add_product')}
             className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'add_product' ? 'bg-blue-50 text-amazonia-blue' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <PlusCircle size={18} /> Add Product
           </button>
           <button 
             onClick={() => setActiveTab('profile')}
             className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-amazonia-blue' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <Settings size={18} /> Seller Profile
           </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
           <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'orders' ? 'bg-amazonia-blue text-white' : 'bg-white border'}`}>Orders</button>
           <button onClick={() => setActiveTab('add_product')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'add_product' ? 'bg-amazonia-blue text-white' : 'bg-white border'}`}>Add Product</button>
           <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'profile' ? 'bg-amazonia-blue text-white' : 'bg-white border'}`}>Profile</button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Total Orders</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Pending Shipments</div>
                  <div className="text-3xl font-bold text-violet-600 mt-1">{orders.filter(o => o.status === OrderStatus.PENDING).length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
                  <div className="text-3xl font-bold text-green-600 mt-1">₹{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8">No orders found.</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-amazonia-blue">#{order.id}</td>
                            <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{order.shippingAddress.fullName}</td>
                            <td className="px-6 py-4 font-bold">₹{order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 
                                  order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-amazonia-orange focus:border-amazonia-orange block w-full p-1.5"
                              >
                                  {Object.values(OrderStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                              </select>
                            </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'add_product' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">List a New Product</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.title}
                    onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-amazonia-orange focus:border-amazonia-orange outline-none"
                    placeholder="e.g. Wireless Headphones"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input 
                        required
                        type="number" 
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-2 pl-7 text-sm focus:ring-1 focus:ring-amazonia-orange focus:border-amazonia-orange outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-amazonia-orange outline-none"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Computers">Computers</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Tools">Tools</option>
                      <option value="Books">Books</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-amazonia-orange outline-none"
                    placeholder="Product features and details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-amazonia-orange outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button type="button" className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3">
                      <Upload size={16} className="text-gray-600"/>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank for a random placeholder image.</p>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="isPrime"
                    checked={newProduct.isPrime}
                    onChange={e => setNewProduct({...newProduct, isPrime: e.target.checked})}
                    className="w-4 h-4 text-amazonia-blue rounded focus:ring-amazonia-blue"
                  />
                  <label htmlFor="isPrime" className="text-sm text-gray-700 font-medium flex items-center gap-1">
                     Enable <span className="text-amazonia-blue font-bold italic">prime</span> shipping for this item
                  </label>
                </div>

                <div className="pt-4 border-t">
                  <button type="submit" className="w-full bg-amazonia-yellow hover:bg-amazonia-orange text-white font-medium py-2 rounded-md shadow-sm transition-colors">
                    Save and List Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-10">
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Seller Profile & Verification</h2>
             
             <form onSubmit={handleSaveProfile}>
               {/* Business Info */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <UserCheck size={20} className="text-amazonia-blue"/> Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Business Name</label>
                        <input 
                          type="text" 
                          value={sellerProfile.businessName}
                          onChange={e => setSellerProfile({...sellerProfile, businessName: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tax ID / GSTIN</label>
                        <input 
                          type="text" 
                          value={sellerProfile.taxId}
                          onChange={e => setSellerProfile({...sellerProfile, taxId: e.target.value})}
                          placeholder="e.g. 22AAAAA0000A1Z5"
                          className="w-full border border-gray-300 rounded p-2 text-sm" 
                        />
                     </div>
                  </div>
               </div>

               {/* Address */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-amazonia-blue"/> Registered Business Address
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          value={sellerProfile.street}
                          onChange={e => setSellerProfile({...sellerProfile, street: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                          <input 
                            type="text" 
                            value={sellerProfile.city}
                            onChange={e => setSellerProfile({...sellerProfile, city: e.target.value})}
                            className="w-full border border-gray-300 rounded p-2 text-sm" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">State / Province</label>
                          <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" />
                       </div>
                     </div>
                  </div>
               </div>

               {/* Bank Details */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-amazonia-blue"/> Bank Account for Payouts
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Account Holder Name</label>
                        <input 
                          type="text" 
                          value={sellerProfile.accountHolder}
                          onChange={e => setSellerProfile({...sellerProfile, accountHolder: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Account Number</label>
                          <input 
                            type="text" 
                            value={sellerProfile.accountNumber}
                            onChange={e => setSellerProfile({...sellerProfile, accountNumber: e.target.value})}
                            className="w-full border border-gray-300 rounded p-2 text-sm" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">IFSC / Sort Code</label>
                          <input 
                            type="text" 
                            value={sellerProfile.ifsc}
                            onChange={e => setSellerProfile({...sellerProfile, ifsc: e.target.value})}
                            className="w-full border border-gray-300 rounded p-2 text-sm" 
                          />
                       </div>
                     </div>
                  </div>
               </div>

               {/* Documents */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-amazonia-blue"/> Identity & Documents
                  </h3>
                  <div className="space-y-4">
                    <div 
                      onClick={() => simulateUpload('id')}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative ${docsUploaded.id ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                       {docsUploaded.id ? <CheckCircle className="mx-auto text-green-600 mb-2" size={32} /> : <Upload className="mx-auto text-gray-400 mb-2" size={32} />}
                       <div className="text-sm font-bold text-gray-700">{docsUploaded.id ? 'National ID Uploaded' : 'Upload National ID (Passport/Driver\'s License)'}</div>
                       <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG up to 5MB</p>
                    </div>
                    <div 
                      onClick={() => simulateUpload('license')}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative ${docsUploaded.license ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                       {docsUploaded.license ? <CheckCircle className="mx-auto text-green-600 mb-2" size={32} /> : <Upload className="mx-auto text-gray-400 mb-2" size={32} />}
                       <div className="text-sm font-bold text-gray-700">{docsUploaded.license ? 'Business License Uploaded' : 'Upload Business License'}</div>
                       <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG up to 5MB</p>
                    </div>
                  </div>
               </div>

               <div className="flex justify-end">
                 <button type="submit" className="bg-amazonia-yellow hover:bg-amazonia-orange text-white font-bold py-2 px-8 rounded shadow-sm">
                   Save Profile & Documents
                 </button>
               </div>
             </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerDashboard;