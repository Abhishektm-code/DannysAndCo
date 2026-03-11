import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Package, MapPin, User, LogOut, ChevronRight, Clock } from "lucide-react";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || '{"username": "Guest", "email": "", "id": 0}');

  useEffect(() => {
    if (user.id === 0) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-stone-900 text-white rounded-full flex items-center justify-center text-2xl font-black mb-4">
                {user.username[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-black tracking-tighter text-stone-900">{user.username}</h2>
              <p className="text-stone-400 text-xs font-medium">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-stone-50 text-stone-900 rounded-2xl font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center space-x-3">
                  <Package size={18} />
                  <span>My Orders</span>
                </div>
                <ChevronRight size={14} />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-stone-400 hover:bg-stone-50 hover:text-stone-900 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                <div className="flex items-center space-x-3">
                  <MapPin size={18} />
                  <span>Addresses</span>
                </div>
                <ChevronRight size={14} />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-stone-400 hover:bg-stone-50 hover:text-stone-900 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                <div className="flex items-center space-x-3">
                  <User size={18} />
                  <span>Profile Settings</span>
                </div>
                <ChevronRight size={14} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all mt-8"
              >
                <div className="flex items-center space-x-3">
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 mb-12">ORDER HISTORY</h1>
          
          {orders.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-50 rounded-full mb-6 text-stone-300">
                <Clock size={32} />
              </div>
              <h2 className="text-2xl font-black text-stone-900 mb-4">No orders yet</h2>
              <p className="text-stone-500 mb-10 max-w-xs mx-auto">When you place an order, it will appear here.</p>
              <button
                onClick={() => navigate("/shop")}
                className="inline-block bg-stone-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-stone-100 bg-stone-50/50 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Order Placed</p>
                        <p className="text-sm font-bold text-stone-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-stone-900">₹{order.total_price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Status</p>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                          order.shipping_status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                          order.shipping_status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {order.shipping_status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Order ID</p>
                      <p className="text-sm font-bold text-stone-900">#DW-{order.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-stone-50 shrink-0">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="grow">
                          <h4 className="text-sm font-black text-stone-900">{item.name}</h4>
                          <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest mt-1">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-black text-stone-900 mt-2">₹{item.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/product/${item.product_id}`)}
                          className="px-6 py-3 border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-stone-50 transition-all"
                        >
                          Buy Again
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
