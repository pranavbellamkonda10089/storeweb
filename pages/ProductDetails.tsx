import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Star, Truck, ShieldCheck, MapPin, Video, Image as ImageIcon, Send } from 'lucide-react';
import { Review, OrderStatus } from '../types';
import { getProductAnalysis, summarizeReviews } from '../services/geminiService';
import ImageMagnifier from '../components/ImageMagnifier';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, reviews, user, addReview } = useStore();
  const [activeImage, setActiveImage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [userQuery, setUserQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // New Review Form State
  const [reviewForm, setReviewForm] = useState<{rating: number, title: string, text: string}>({
    rating: 5, title: '', text: ''
  });

  const product = products.find(p => p.id === id) || products[0]; // Fallback for duplicated items
  const productReviews = reviews[product.id] || [];

  useEffect(() => {
    if (product) setActiveImage(product.image);
  }, [product]);

  if (!product) return <div>Product not found</div>;

  const handleAiQuery = async () => {
    if (!userQuery.trim()) return;
    setIsTyping(true);
    const answer = await getProductAnalysis(product, userQuery);
    setAiResponse(answer);
    setIsTyping(false);
  };

  const handleReviewSummary = async () => {
    setIsTyping(true);
    const reviewTexts = productReviews.map(r => r.text);
    const sum = await summarizeReviews(reviewTexts);
    setSummary(sum);
    setIsTyping(false);
  };

  const submitReview = () => {
    if(!user) return alert("Please sign in to review");
    const newReview: Review = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      date: new Date().toLocaleDateString(),
      verifiedPurchase: true,
      ...reviewForm
    };
    addReview(product.id, newReview);
    setReviewForm({ rating: 5, title: '', text: '' });
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 bg-white mt-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Images */}
        <div className="md:col-span-4 lg:col-span-5 flex gap-4 sticky top-24 self-start z-30">
           <div className="flex flex-col gap-2">
              <img src={product.image} className="w-10 h-10 border hover:border-storeweb-primary cursor-pointer object-contain" onMouseEnter={() => setActiveImage(product.image)} />
              {product.images?.map((img, idx) => (
                <img key={idx} src={img} className="w-10 h-10 border hover:border-storeweb-primary cursor-pointer object-contain" onMouseEnter={() => setActiveImage(img)} />
              ))}
              {/* Fallback mock images if none exist */}
              {!product.images && (
                 <img src="https://picsum.photos/id/10/400/400" className="w-10 h-10 border hover:border-storeweb-primary cursor-pointer" onMouseEnter={() => setActiveImage("https://picsum.photos/id/10/400/400")} />
              )}
           </div>
           <div className="flex-1 relative">
             <ImageMagnifier src={activeImage} />
           </div>
        </div>

        {/* Details */}
        <div className="md:col-span-5 lg:col-span-4">
           <h1 className="text-2xl font-medium text-gray-900">{product.title}</h1>
           <div className="flex items-center gap-2 mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-storeweb-accent text-sm hover:underline">{product.reviewCount} ratings</span>
           </div>
           <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex items-start gap-1">
                 <span className="text-xs pt-1">₹</span>
                 <span className="text-3xl font-medium">{Math.floor(product.price)}</span>
                 <span className="text-xs pt-1">{(product.price % 1).toFixed(2).substring(1)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
           </div>
           <div className="mt-4">
              <h3 className="font-bold mb-2">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
           </div>

           {/* AI Assistant */}
           <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
             <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-2">
               <span className="bg-storeweb-dark text-white text-xs px-1 rounded">AI</span>
               Ask about this product
             </h3>
             <div className="flex gap-2 mb-2">
               <input 
                 type="text" 
                 value={userQuery}
                 onChange={(e) => setUserQuery(e.target.value)}
                 placeholder="Is this good for gaming?"
                 className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-storeweb-primary"
               />
               <button onClick={handleAiQuery} className="bg-storeweb-primary text-white p-1 rounded hover:bg-storeweb-hover transition-colors">
                 <Send size={16} />
               </button>
             </div>
             {isTyping && <p className="text-xs text-gray-500 animate-pulse">AI is thinking...</p>}
             {aiResponse && <p className="text-sm text-gray-800 bg-white p-2 rounded border border-slate-200 mt-2 shadow-sm">{aiResponse}</p>}
           </div>
        </div>

        {/* Buy Box */}
        <div className="md:col-span-3 lg:col-span-3">
          <div className="border border-gray-300 rounded-lg p-4 sticky top-24">
             <div className="text-2xl font-medium text-red-700 mb-2">₹{product.price.toFixed(2)}</div>
             <div className="text-sm text-gray-600 mb-4">
                FREE delivery <b>Monday, Nov 15</b>.
                <div className="flex items-center gap-1 text-xs mt-1 text-storeweb-accent">
                   <MapPin size={12} /> Deliver to New York 10001
                </div>
             </div>
             <h4 className="text-green-700 text-lg font-medium mb-4">In Stock</h4>
             
             <button 
               onClick={() => addToCart(product, 1)}
               className="w-full bg-storeweb-primary hover:bg-storeweb-hover text-white rounded-full py-2 text-sm mb-2 shadow-sm transition-colors font-medium"
             >
               Add to Cart
             </button>
             <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2 text-sm mb-4 shadow-sm transition-colors font-medium">
               Buy Now
             </button>
             
             <div className="text-xs text-gray-500 grid grid-cols-2 gap-y-1">
                <span>Ships from</span> <span>StoreWeb</span>
                <span>Sold by</span> <span>StoreWeb Services</span>
             </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
         <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
         
         <div className="flex flex-col md:flex-row gap-8">
           <div className="w-full md:w-1/3">
             <div className="flex items-center gap-2 mb-4">
               <span className="text-4xl font-bold">{product.rating}</span>
               <div className="flex flex-col">
                 <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                 </div>
                 <span className="text-sm text-gray-500">{product.reviewCount} global ratings</span>
               </div>
             </div>
             <button 
               onClick={handleReviewSummary}
               className="text-sm border border-gray-300 shadow-sm rounded-md px-4 py-2 hover:bg-gray-50 w-full mb-4 text-left flex justify-between items-center"
             >
               <span>Summarize reviews with AI</span>
               <span className="text-xs bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-1 rounded">Beta</span>
             </button>
             {summary && (
               <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 mb-4 border border-gray-200">
                 <h4 className="font-bold mb-1">AI Summary:</h4>
                 <div className="whitespace-pre-wrap">{summary}</div>
               </div>
             )}

             {/* Add Review */}
             <div className="border p-4 rounded bg-gray-50 mt-4">
               <h3 className="font-bold text-sm mb-2">Write a review</h3>
               <input className="w-full border p-2 mb-2 text-sm rounded" placeholder="Title" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})}/>
               <textarea className="w-full border p-2 mb-2 text-sm rounded" placeholder="Review text" value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} />
               <button onClick={submitReview} className="w-full border border-gray-300 bg-white hover:bg-gray-100 py-1 text-sm rounded shadow-sm transition-colors">Submit Review</button>
             </div>
           </div>

           <div className="w-full md:w-2/3 space-y-6">
             {productReviews.map((review) => (
               <div key={review.id} className="border-b pb-6">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-700 font-bold">{review.userName[0]}</div>
                   <span className="text-sm font-medium">{review.userName}</span>
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />)}
                   </div>
                   <span className="font-bold text-sm">{review.title}</span>
                 </div>
                 <div className="text-xs text-gray-500 mb-2">Reviewed on {review.date}</div>
                 {review.verifiedPurchase && (
                   <div className="text-xs text-storeweb-primary font-bold mb-2">Verified Purchase</div>
                 )}
                 <p className="text-sm text-gray-800 mb-3">{review.text}</p>
                 
                 {/* Media */}
                 <div className="flex gap-2">
                   {review.images?.map((img, i) => (
                     <img key={i} src={img} className="w-20 h-20 object-cover border rounded cursor-pointer" />
                   ))}
                   {review.video && (
                      <div className="relative w-32 h-20 bg-black rounded overflow-hidden group cursor-pointer">
                        <video src={review.video} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10">
                           <Video className="text-white" />
                        </div>
                      </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetails;