import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

useEffect(() => {
  fetch("https://dannysandco.onrender.com")
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      setLoading(false);
    });
}, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = filter === "All" || p.category === filter;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Popularity") return (b.rating || 0) - (a.rating || 0);
      return b.id - a.id; // Newest
    });

  const sortOptions = ["Newest", "Popularity", "Price: Low to High", "Price: High to Low"];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-8 md:space-y-0">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-stone-900 mb-2">
            {searchQuery ? `RESULTS FOR "${searchQuery.toUpperCase()}"` : "SHOP THE COLLECTION"}
          </h2>
          <p className="text-stone-500 text-sm">
            {searchQuery 
              ? `Found ${filteredProducts.length} items matching your search.` 
              : "Curated essentials for the modern wardrobe."}
          </p>
          {searchQuery && (
            <button 
              onClick={() => navigate(location.pathname)}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors flex items-center"
            >
              Clear Search
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          {/* Filters */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Filter by Category</span>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    filter === cat
                      ? "bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200"
                      : "bg-white text-stone-400 border-stone-100 hover:border-stone-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-100 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 shadow-sm"
            >
              {sortOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-stone-100 rounded-3xl border border-dashed border-stone-300">
          <p className="text-stone-500 font-medium italic">No products found in this category.</p>
        </div>
      )}
    </section>
  );
}
