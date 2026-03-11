import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user ID
  const userId = 1;

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist/${userId}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      fetchWishlist();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
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
      <div className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 mb-2">MY WISHLIST</h1>
          <p className="text-stone-500 text-sm">You have {items.length} items saved for later.</p>
        </div>
        <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-50 rounded-full mb-6 text-stone-300">
            <Heart size={32} />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-4">Your wishlist is empty</h2>
          <p className="text-stone-500 mb-10 max-w-xs mx-auto">Save items you love to your wishlist to find them easily later.</p>
          <Link
            to="/shop"
            className="inline-block bg-stone-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <ProductCard product={product} />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-500 shadow-lg z-20 hover:scale-110 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
