import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import { motion } from "motion/react";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <ProductGrid />
      
      {/* Newsletter/Contact Section */}
      <section className="bg-stone-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">NEED HELP?</h2>
          <p className="text-stone-400 mb-10 max-w-lg mx-auto">
            Our style consultants are available to help you find the perfect fit. Reach out to us directly on WhatsApp.
          </p>
          <a 
            href="https://wa.me/7676528949" 
            target="_blank"
            className="inline-block bg-white text-stone-900 px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </motion.div>
  );
}
