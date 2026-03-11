import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Search, X, Heart, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-stone-900"
          >
            DANNY'S & CO.
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-widest ${
                    isActive
                      ? "text-stone-900"
                      : "text-stone-400 hover:text-stone-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-400 hover:text-stone-900"
            >
              <Search size={20} />
            </button>
{/* 
            <Link to="/wishlist" className="p-2 text-stone-400 hover:text-stone-900">
              <Heart size={20} />
            </Link> */}

            <Link to="/profile" className="p-2 text-stone-400 hover:text-stone-900">
              <User size={20} />
            </Link>

            {/* <Link to="/cart" className="relative p-2 text-stone-400 hover:text-stone-900">
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full">
                0
              </span>
            </Link> */}

            {/* Burger Button (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-stone-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-stone-200"
          >
            <div className="flex flex-col items-center py-6 space-y-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest text-stone-700 hover:text-stone-900"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-white z-60 flex items-center px-4 sm:px-6 lg:px-8"
          >
            <form onSubmit={handleSearch} className="w-full max-w-7xl mx-auto flex items-center">
              <Search className="text-stone-400 mr-4" size={24} />

              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow bg-transparent border-none outline-none text-xl font-medium text-stone-900 placeholder:text-stone-300"
              />

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-900"
              >
                <X size={24} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}