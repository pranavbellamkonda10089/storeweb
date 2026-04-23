
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <Construction size={64} className="text-storeweb-primary mb-6 animate-bounce" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <Link 
        to="/" 
        className="bg-storeweb-primary hover:bg-storeweb-hover text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Back to Shopping
      </Link>
    </div>
  );
};

export default ComingSoon;
