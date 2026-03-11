import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-stone-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Hero"
          className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1 bg-white text-stone-900 text-[8px] font-black uppercase tracking-[0.3em] mb-6 rounded-full">
            New Arrival 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-8">
            Wear Your Attitude <br />
            <span className="text-stone-400">EVERYDAY STYLE.</span>
          </h1>
          <p className="text-stone-300 text-lg mb-5 max-w-lg leading-relaxed">
            Discover our curated collection of premium essentials, crafted for the modern individual who values quality and timeless design.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="group flex items-center space-x-3 bg-white text-stone-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-200 transition-all"
            >
              <span>Shop Collection</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex flex-col items-end space-y-2">
          <div className="h-px w-20 bg-white/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Est. 2024</span>
        </div>
      </div>
    </div>
  );
}
