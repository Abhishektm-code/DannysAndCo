import { MessageCircle, Heart, Star, Eye, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const handleWhatsAppOrder = () => {
    const phoneNumber = "7676528949";
    const message = encodeURIComponent(`Hello, I want to order ${product.name} with the cost of ₹${product.price.toLocaleString()}. Can you assist me with the order?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group bg-white border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-500 rounded-2xl relative"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-stone-50">
        {/* Main Image */}
        <img
          src={product.image_url || `https://picsum.photos/seed/${product.id}/600/800`}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${product.hover_image_url ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Hover Image */}
        {product.hover_image_url && (
          <img
            src={product.hover_image_url}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110 group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-900 rounded-full border border-stone-100 shadow-sm">
            {product.category}
          </span>
          {product.discount > 0 && (
            <span className="bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Icon
        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full border border-stone-100 text-stone-400 hover:text-red-500 transition-colors shadow-sm z-10">
          <Heart size={16} />
        </button> */}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link 
            to={`/product/${product.id}`}
            className="p-3 bg-white text-stone-900 rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={20} />
          </Link>
          {/* <button 
            className="p-3 bg-white text-stone-900 rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            <ShoppingCart size={20} />
          </button> */}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            {product.brand || "Danny's Wear"}
          </p>
          <div className="flex items-center text-stone-900 text-[10px] font-bold">
            <Star size={10} className="fill-yellow-400 text-yellow-400 mr-1" />
            <span>{product.rating || "4.5"}</span>
            <span className="text-stone-300 ml-1">({product.review_count || "0"})</span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-stone-900 mb-2 group-hover:text-stone-600 transition-colors truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <p className="text-lg font-bold text-stone-900">
            ₹{product.price.toLocaleString()}
          </p>
          {product.original_price && (
            <p className="text-sm text-stone-300 line-through">
              ₹{product.original_price.toLocaleString()}
            </p>
          )}
        </div>
        
        <button
          onClick={handleWhatsAppOrder}
          className="w-full flex items-center justify-center space-x-2 bg-stone-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all duration-300 transform active:scale-95"
        >
          <MessageCircle size={18} />
          <span>Order on WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
}
