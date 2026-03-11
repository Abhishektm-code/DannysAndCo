import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  ArrowLeft, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw 
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
        if (data.sizes) setSelectedSize(data.sizes.split(",")[0]);
        if (data.colors) setSelectedColor(data.colors.split(",")[0]);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });

    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Mock user ID for now, should get from auth
          productId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        }),
      });
      if (response.ok) {
        setReviewForm({ rating: 5, comment: "" });
        // Refresh reviews
        const res = await fetch(`/api/reviews/${id}`);
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error adding review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "7676528949";
    const message = encodeURIComponent(`Hello, I want to order ${product.name} (Size: ${selectedSize}, Color: ${selectedColor})`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black mb-4">Product Not Found</h2>
        <button onClick={() => navigate("/shop")} className="text-stone-500 hover:text-stone-900 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  const images = [product.image_url, product.hover_image_url].filter(Boolean);
  const sizes = product.sizes ? product.sizes.split(",") : [];
  const colors = product.colors ? product.colors.split(",") : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] overflow-hidden bg-stone-100 rounded-[2.5rem] border border-stone-100">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={images[activeImage] || `https://picsum.photos/seed/${product.id}/800/1000`}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? "border-stone-900 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-stone-400 mb-2">
                  {product.brand || "Danny's Wear"}
                </p>
                <h1 className="text-4xl font-black tracking-tighter text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>
              <button className="p-3 bg-stone-50 rounded-full text-stone-300 hover:text-red-500 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center bg-stone-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.rating || "4.5"}</span>
              </div>
              <span className="text-stone-400 text-xs font-medium">
                {product.review_count || "0"} Reviews
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <p className="text-4xl font-black text-stone-900">
                ₹{product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <div className="flex flex-col">
                  <p className="text-lg text-stone-300 line-through">
                    ₹{product.original_price.toLocaleString()}
                  </p>
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Select Size</label>
                <button className="text-[10px] font-black uppercase tracking-widest text-stone-900 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 font-bold transition-all ${
                      selectedSize === size
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-100 text-stone-400 hover:border-stone-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-10">
              <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Select Color</label>
              <div className="flex flex-wrap gap-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative w-10 h-10 rounded-full border-2 p-1 transition-all ${
                      selectedColor === color ? "border-stone-900" : "border-transparent"
                    }`}
                  >
                    <div 
                      className="w-full h-full rounded-full shadow-inner" 
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="flex-grow flex items-center justify-center space-x-3 bg-stone-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all transform active:scale-[0.98]">
              <ShoppingBag size={20} />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex-grow flex items-center justify-center space-x-3 bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all transform active:scale-[0.98]"
            >
              <MessageCircle size={20} />
              <span>Order on WhatsApp</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-stone-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-stone-50 rounded-2xl text-stone-900">
                <Truck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Free Delivery</span>
                <span className="text-[10px] text-stone-400">On orders over ₹999</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-stone-50 rounded-2xl text-stone-900">
                <RotateCcw size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">7 Day Returns</span>
                <span className="text-[10px] text-stone-400">Easy exchange policy</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-stone-50 rounded-2xl text-stone-900">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">100% Authentic</span>
                <span className="text-[10px] text-stone-400">Quality guaranteed</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-12 pt-12 border-t border-stone-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Product Description</h3>
            <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed">
              {product.description || "No description available for this product."}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 pt-12 border-t border-stone-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Customer Reviews ({reviews.length})</h3>
            </div>

            {/* Add Review Form */}
            <div className="bg-stone-50 p-8 rounded-3xl mb-12">
              <h4 className="font-bold mb-6">Write a Review</h4>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-stone-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Your Comment</label>
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all resize-none"
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  {submittingReview ? "Posting..." : "Post Review"}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
              {reviews.length === 0 ? (
                <p className="text-sm text-stone-400 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-50 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{review.username}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-stone-200"}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
