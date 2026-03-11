import React from "react";
import ProductGrid from "../components/ProductGrid";

export default function Shop() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-stone-900 mb-4">THE SHOP</h1>
        <p className="text-stone-500 max-w-2xl">Explore our curated collection of premium essentials, designed for those who appreciate quality and timeless style.</p>
      </div>
      <ProductGrid />
    </div>
  );
}
