import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, LogOut, Package, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("Shirts");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("S,M,L,XL");
  const [colors, setColors] = useState("Black,White,Blue");
  const [stock, setStock] = useState("100");
  const [image, setImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("adminUser");
    if (!admin) {
      navigate("/admin");
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [navigate]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await fetch(`/api/admin/products/${id}/stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("original_price", originalPrice);
    formData.append("discount", discount);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("sizes", sizes);
    formData.append("colors", colors);
    if (image) formData.append("image", image);
    if (hoverImage) formData.append("hover_image", hoverImage);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setName("");
        setBrand("");
        setPrice("");
        setOriginalPrice("");
        setDiscount("");
        setCategory("Shirts");
        setDescription("");
        setSizes("S,M,L,XL");
        setColors("Black,White,Blue");
        setImage(null);
        setHoverImage(null);
        fetchProducts();
      }
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-stone-900">ADMIN DASHBOARD</h1>
          <div className="flex gap-6 mt-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${
                activeTab === "products" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${
                activeTab === "orders" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-stone-500 hover:text-red-600 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {activeTab === "products" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Plus className="text-stone-900" size={20} />
                <h2 className="text-lg font-bold tracking-tight">Add New Product</h2>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      placeholder="e.g. Danny's Wear"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Original Price</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                    >
                      <option>Shirts</option>
                      <option>T-shirts</option>
                      <option>Jeans</option>
                      <option>Trousers</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Stock Level</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Sizes (CSV)</label>
                    <input
                      type="text"
                      value={sizes}
                      onChange={(e) => setSizes(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      placeholder="S,M,L,XL"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Colors (CSV)</label>
                    <input
                      type="text"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      placeholder="Black,White,Red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none text-sm h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Main Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="hidden"
                        id="image-upload"
                        accept="image/*"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-stone-400 transition-all text-stone-500"
                      >
                        <ImageIcon size={18} />
                        <span className="text-[10px] font-medium truncate">{image ? image.name : "Main"}</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Hover Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setHoverImage(e.target.files?.[0] || null)}
                        className="hidden"
                        id="hover-image-upload"
                        accept="image/*"
                      />
                      <label
                        htmlFor="hover-image-upload"
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-stone-400 transition-all text-stone-500"
                      >
                        <ImageIcon size={18} />
                        <span className="text-[10px] font-medium truncate">{hoverImage ? hoverImage.name : "Hover"}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
              <div className="p-8 border-b border-stone-100 flex items-center space-x-2">
                <Package className="text-stone-900" size={20} />
                <h2 className="text-lg font-bold tracking-tight">Current Inventory</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Product</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Stock</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Price</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <AnimatePresence>
                      {products.map((product) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.image_url || `https://picsum.photos/seed/${product.id}/50/50`}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-stone-900">{product.name}</span>
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest">{product.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <input
                              type="number"
                              value={product.stock}
                              onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                              className="w-20 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <span className="px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-500 rounded-full">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <span className="text-sm font-bold text-stone-900">₹{product.price}</span>
                          </td>
                          <td className="px-8 py-4">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                
                {products.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-stone-400 text-sm italic">No products in inventory.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
          <div className="p-8 border-b border-stone-100 flex items-center space-x-2">
            <ShoppingBag className="text-stone-900" size={20} />
            <h2 className="text-lg font-bold tracking-tight">Customer Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Total</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs">#ORD-{order.id}</td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-stone-900">{order.username}</span>
                        <span className="text-[10px] text-stone-400">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-sm">₹{order.total_price.toLocaleString()}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.shipping_status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.shipping_status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {order.shipping_status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs text-stone-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4">
                      <select
                        value={order.shipping_status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] font-bold uppercase tracking-widest"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-stone-400 text-sm italic">No orders yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
