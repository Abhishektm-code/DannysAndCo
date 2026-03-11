// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";

// export default function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Mock user ID for now - in real app, get from auth context
//   const userId = 1;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       const res = await fetch(`/api/cart/${userId}`);
//       const data = await res.json();
//       setCartItems(data);
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (cartId, newQuantity) => {
//     if (newQuantity < 1) return;
//     try {
//       await fetch(`/api/cart/${cartId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ quantity: newQuantity }),
//       });
//       fetchCart();
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//     }
//   };

//   const removeItem = async (cartId) => {
//     try {
//       await fetch(`/api/cart/${cartId}`, { method: "DELETE" });
//       fetchCart();
//     } catch (err) {
//       console.error("Error removing item:", err);
//     }
//   };

//   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const shipping = subtotal > 999 ? 0 : 99;
//   const total = subtotal + shipping;

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//       <div className="flex items-end justify-between mb-12">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter text-stone-900 mb-2">SHOPPING BAG</h1>
//           <p className="text-stone-500 text-sm">You have {cartItems.length} items in your bag.</p>
//         </div>
//         <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
//           Continue Shopping
//         </Link>
//       </div>

//       {cartItems.length === 0 ? (
//         <div className="text-center py-32 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-50 rounded-full mb-6 text-stone-300">
//             <ShoppingBag size={32} />
//           </div>
//           <h2 className="text-2xl font-black text-stone-900 mb-4">Your bag is empty</h2>
//           <p className="text-stone-500 mb-10 max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
//           <Link
//             to="/shop"
//             className="inline-block bg-stone-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
//           >
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
//           {/* Items List */}
//           <div className="lg:col-span-2 space-y-8">
//             <AnimatePresence>
//               {cartItems.map((item) => (
//                 <motion.div
//                   key={item.cart_id}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-4xl border border-stone-100 shadow-sm group"
//                 >
//                   <div className="w-full sm:w-32 aspect-3/4 rounded-2xl overflow-hidden bg-stone-50">
//                     <img
//                       src={item.image_url || `https://picsum.photos/seed/${item.id}/300/400`}
//                       alt={item.name}
//                       className="w-full h-full object-cover"
//                       referrerPolicy="no-referrer"
//                     />
//                   </div>
                  
//                   <div className="grow flex flex-col justify-between py-2">
//                     <div>
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">{item.brand || "Danny's Wear"}</p>
//                           <h3 className="text-lg font-black tracking-tight text-stone-900">{item.name}</h3>
//                         </div>
//                         <button 
//                           onClick={() => removeItem(item.cart_id)}
//                           className="p-2 text-stone-300 hover:text-red-500 transition-colors"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
                      
//                       <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-stone-500">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-stone-300">Size:</span>
//                           <span className="text-stone-900">{item.size}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-stone-300">Color:</span>
//                           <span className="text-stone-900">{item.color}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-end mt-6">
//                       <div className="flex items-center bg-stone-50 rounded-xl p-1 border border-stone-100">
//                         <button 
//                           onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
//                           className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
//                         >
//                           <Minus size={14} />
//                         </button>
//                         <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
//                         <button 
//                           onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
//                           className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
//                         >
//                           <Plus size={14} />
//                         </button>
//                       </div>
//                       <p className="text-xl font-black text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>

//           {/* Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl sticky top-24">
//               <h2 className="text-xl font-black tracking-tighter text-stone-900 mb-8">ORDER SUMMARY</h2>
              
//               <div className="space-y-4 mb-8">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-stone-400 font-medium">Subtotal</span>
//                   <span className="text-stone-900 font-black">₹{subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-stone-400 font-medium">Shipping</span>
//                   <span className="text-stone-900 font-black">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
//                 </div>
//                 {shipping > 0 && (
//                   <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
//                     Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
//                   </p>
//                 )}
//                 <div className="pt-4 border-t border-stone-100 flex justify-between">
//                   <span className="text-lg font-black tracking-tight">Total</span>
//                   <span className="text-2xl font-black tracking-tight">₹{total.toLocaleString()}</span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => navigate("/checkout")}
//                 className="w-full flex items-center justify-center space-x-3 bg-stone-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
//               >
//                 <span>Proceed to Checkout</span>
//                 <ArrowRight size={16} />
//               </button>
              
//               <div className="mt-8 space-y-4">
//                 <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
//                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//                   <span>Secure Checkout</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
//                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//                   <span>Free returns within 7 days</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
