import React from "react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-stone-900 mb-8">CRAFTED FOR THE MODERN INDIVIDUAL.</h1>
          <div className="space-y-6 text-stone-600 leading-relaxed">
            <p>Danny's Wear & Co. was founded on the principle that quality should never be compromised. We believe in creating pieces that last beyond seasons, focusing on exceptional materials and timeless silhouettes.</p>
            <p>Our journey started with a simple goal: to provide a curated selection of essentials that empower personal expression through understated elegance.</p>
            <p>Every piece in our collection is a testament to our commitment to craftsmanship and attention to detail.</p>
          </div>
        </div>
        <div className="aspect-square bg-stone-200 rounded-[3rem] overflow-hidden">
          <img 
            src="https://picsum.photos/seed/fashion/800/800" 
            alt="About Danny's Wear" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
