
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m StoreWeb\'s AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dragging State
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const { user, cart, orders, products, reviews } = useStore();
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize position on open
  useEffect(() => {
    if (isOpen && position === null) {
      // Default to bottom-right, above the button
      const width = window.innerWidth < 640 ? 320 : 384; // w-80 (320px) vs w-96 (384px)
      const height = 500;
      setPosition({
        x: Math.max(10, window.innerWidth - width - 24),
        y: Math.max(10, window.innerHeight - height - 100)
      });
    }
  }, [isOpen]);

  // Initialize chat session when opened or when context changes significantly
  useEffect(() => {
    if (isOpen) {
      const contextData = JSON.stringify({
        currentUser: user ? { name: user.name, email: user.email, role: user.role } : 'Guest',
        cartItems: cart.map(c => ({ title: c.title, qty: c.quantity, price: c.price })),
        recentOrders: orders.filter(o => o.userId === user?.id).map(o => ({
          id: o.id,
          status: o.status,
          total: o.total,
          date: o.date,
          items: o.items.map(i => i.title)
        })),
        productCatalog: products.map(p => ({
           id: p.id,
           title: p.title,
           price: p.price,
           category: p.category,
           description: p.description
        })),
        productReviews: reviews
      });
      
      chatSessionRef.current = createChatSession(contextData);
    }
  }, [isOpen, user, cart, orders, products, reviews]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
         // Fallback re-init if something went wrong
         const contextData = JSON.stringify({
          currentUser: user ? { name: user.name, email: user.email, role: user.role } : 'Guest',
          cartItems: cart.map(c => ({ title: c.title, qty: c.quantity, price: c.price })),
          recentOrders: orders.filter(o => o.userId === user?.id).map(o => ({
            id: o.id,
            status: o.status,
            total: o.total,
            date: o.date,
            items: o.items.map(i => i.title)
          })),
          productCatalog: products.map(p => ({
             id: p.id,
             title: p.title,
             price: p.price,
             category: p.category,
             description: p.description
          })),
          productReviews: reviews
         }); 
         chatSessionRef.current = createChatSession(contextData);
      }
      
      // result.text is a property, not a method
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || "I'm not sure how to answer that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {isOpen && position && (
        <div 
          ref={windowRef}
          style={{ left: position.x, top: position.y }}
          className="fixed z-[60] bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header - Draggable */}
          <div 
            onMouseDown={handleMouseDown}
            className="bg-storeweb-light text-white p-4 flex justify-between items-center shadow-md cursor-move select-none"
          >
             <div className="flex items-center gap-2 pointer-events-none">
                <div className="bg-white text-storeweb-light p-1 rounded-full">
                   <Bot size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-sm">StoreWeb Assistant</h3>
                   <span className="text-xs text-green-400 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                   </span>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded cursor-pointer">
                <Minimize2 size={18} />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-storeweb-light text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-storeweb-accent text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}>
                     {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
               </div>
             ))}
             {isLoading && (
               <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-storeweb-light text-white flex items-center justify-center shrink-0">
                      <Bot size={14} />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                     <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                     </div>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
             <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border focus-within:border-storeweb-primary focus-within:ring-1 focus-within:ring-storeweb-primary transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about orders, products..." 
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-1.5 rounded-full transition-colors ${input.trim() ? 'bg-storeweb-accent text-white hover:bg-storeweb-primary' : 'text-gray-400'}`}
                >
                   <Send size={16} />
                </button>
             </div>
             <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">AI-generated responses may be inaccurate.</span>
             </div>
          </div>
        </div>
      )}

      {/* Toggle Button - Fixed */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`${isOpen ? 'bg-gray-600' : 'bg-storeweb-primary hover:bg-storeweb-hover'} text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group`}
        >
          {isOpen ? <X size={24} className="text-white"/> : <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />}
          {!isOpen && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>}
        </button>
      </div>
    </>
  );
};

export default Chatbot;
