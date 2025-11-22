import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Download, ArrowLeft } from 'lucide-react';

declare const html2pdf: any;

const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <Link to="/orders" className="text-amazonia-blue hover:underline">Back to orders</Link>
      </div>
    );
  }

  const handleDownload = () => {
    if (typeof html2pdf === 'undefined') {
      alert('PDF generation library is not loaded. Please try again or use the browser print function.');
      return;
    }

    const element = invoiceRef.current;
    const opt = {
      margin: 10,
      filename: `Amazonia_Invoice_${order.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Recalculate subtotal for display
  const subtotal = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tax = order.total - subtotal;

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      {/* Toolbar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print">
         <Link to="/orders" className="flex items-center gap-2 text-sm text-amazonia-blue hover:underline hover:text-orange-700">
           <ArrowLeft size={16} /> Back to Orders
         </Link>
         <div className="flex gap-4">
            <button 
             onClick={() => window.print()}
             className="text-sm text-gray-600 hover:underline"
            >
              Print
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-amazonia-yellow hover:bg-amazonia-orange px-4 py-2 rounded shadow-sm font-medium text-sm transition-colors"
            >
              <Download size={16} /> Download PDF
            </button>
         </div>
      </div>

      {/* Invoice Paper */}
      <div ref={invoiceRef} className="max-w-[210mm] mx-auto bg-white p-12 shadow-lg text-sm text-gray-800 min-h-[297mm]">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 border-b pb-8">
           <div>
              <div className="text-3xl font-bold tracking-tight mb-4">amazonia<span className="text-xs font-normal text-black">.clone</span></div>
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-700">Amazonia Services LLC</p>
                <p>410 Terry Ave N</p>
                <p>Seattle, WA 98109</p>
                <p>United States</p>
              </div>
           </div>
           <div className="text-right">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">INVOICE</h2>
              <div className="space-y-1">
                 <p className="text-gray-600"><span className="font-bold text-gray-800">Order #:</span> {order.id}</p>
                 <p className="text-gray-600"><span className="font-bold text-gray-800">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
              </div>
           </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
           <div>
              <h3 className="font-bold text-gray-800 uppercase text-xs mb-3 tracking-wider border-b pb-1">Bill To</h3>
              <div className="text-gray-600 leading-relaxed">
                 <p className="font-medium text-black">{order.shippingAddress.fullName}</p>
                 <p>{order.shippingAddress.street}</p>
                 <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                 <p>{order.shippingAddress.country}</p>
              </div>
           </div>
           <div>
              <h3 className="font-bold text-gray-800 uppercase text-xs mb-3 tracking-wider border-b pb-1">Ship To</h3>
              <div className="text-gray-600 leading-relaxed">
                 <p className="font-medium text-black">{order.shippingAddress.fullName}</p>
                 <p>{order.shippingAddress.street}</p>
                 <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                 <p>{order.shippingAddress.country}</p>
              </div>
           </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
           <thead>
              <tr className="bg-gray-50 border-y border-gray-200 text-xs uppercase text-gray-600">
                 <th className="text-left py-3 px-4 font-bold w-1/2">Description</th>
                 <th className="text-center py-3 px-4 font-bold">Quantity</th>
                 <th className="text-right py-3 px-4 font-bold">Unit Price</th>
                 <th className="text-right py-3 px-4 font-bold">Amount</th>
              </tr>
           </thead>
           <tbody>
              {order.items.map((item, index) => (
                 <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                       <div className="font-medium text-gray-900">{item.title}</div>
                       <div className="text-xs text-gray-500 mt-1">Sold by: Amazonia Services</div>
                    </td>
                    <td className="text-center py-4 px-4">{item.quantity}</td>
                    <td className="text-right py-4 px-4">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-4 px-4 font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                 </tr>
              ))}
           </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
           <div className="w-72 space-y-3">
              <div className="flex justify-between text-gray-600">
                 <span>Subtotal:</span>
                 <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                 <span>Shipping & Handling:</span>
                 <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                 <span>Total before tax:</span>
                 <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                 <span>Estimated Tax (8%):</span>
                 <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t-2 border-gray-800 pt-3">
                 <span>Grand Total:</span>
                 <span>₹{order.total.toFixed(2)}</span>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-auto pt-8 border-t border-gray-200">
           <p className="mb-2 font-medium">Payment Information</p>
           <p className="mb-6">Paid via Credit Card ending in ****</p>
           <p className="italic">Thank you for shopping with Amazonia. This is a computer-generated invoice.</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;