import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  Smartphone
} from "lucide-react";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "UPI"
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  // Mock user ID
  const userId = 1;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart/${userId}`);
      const data = await res.json();
      setCartItems(data);
      if (data.length === 0 && !isOrdered) navigate("/cart");
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? (subtotal * appliedCoupon.value / 100) 
        : appliedCoupon.value)
    : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = async () => {
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error || "Invalid coupon");
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      userId,
      totalPrice: total,
      couponId: appliedCoupon?.id,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        product_id: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        setIsOrdered(true);
      }
    } catch (err) {
      console.error("Error placing order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-2xl text-center max-w-md"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-stone-900 mb-4">ORDER PLACED!</h1>
          <p className="text-stone-500 mb-10">Thank you for shopping with us. Your order has been successfully placed and is being processed.</p>
          <button
            onClick={() => navigate("/shop")}
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Bag</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 mb-12">CHECKOUT</h1>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Shipping Info */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="text-xl font-black tracking-tight">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Shipping Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all h-32 resize-none"
                    placeholder="House No, Street, Area..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">City</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    placeholder="City Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Pincode</label>
                  <input
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    placeholder="XXXXXX"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="text-xl font-black tracking-tight">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "UPI", icon: Smartphone, label: "UPI / GPay" },
                  { id: "CARD", icon: CreditCard, label: "Card" },
                  { id: "COD", icon: Truck, label: "Cash on Delivery" }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                      formData.paymentMethod === method.id
                        ? "border-stone-900 bg-stone-900 text-white shadow-xl"
                        : "border-stone-100 bg-white text-stone-400 hover:border-stone-200"
                    }`}
                  >
                    <method.icon size={24} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : `Place Order • ₹${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-black tracking-tighter text-stone-900 mb-8">YOUR ORDER</h2>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest mt-1">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-black text-stone-900 mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-100">
              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="Enter code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-500 mt-1">
                    Coupon applied: {appliedCoupon.code} (-₹{discount.toLocaleString()})
                  </p>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-stone-400 font-medium">Subtotal</span>
                <span className="text-stone-900 font-black">₹{subtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-500">
                  <span className="font-medium">Discount</span>
                  <span className="font-black">-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-stone-400 font-medium">Shipping</span>
                <span className="text-stone-900 font-black">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                <span className="text-lg font-black tracking-tight">Total</span>
                <span className="text-2xl font-black tracking-tight">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-stone-100 space-y-4">
              <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>100% Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                <Truck size={16} className="text-emerald-500" />
                <span>Express Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
