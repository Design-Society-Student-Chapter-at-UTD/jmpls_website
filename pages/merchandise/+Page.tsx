import React, { useState, useMemo, useEffect } from "react";
import { ShoppingBag, Search, X, Plus, Minus, Heart, AlertCircle, Check } from "lucide-react";

const PRESET_DONATIONS = [10, 25, 50, 100];

const CART_STORAGE_KEY = "jmpls_cart";

function loadCart(): any[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: any[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<any[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productsData, setProductsData] = useState<any[]>([]);

  // Donation form state
  const [donationAmount, setDonationAmount] = useState<number | "custom">(25);
  const [customDonation, setCustomDonation] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);
  
  // Fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProductsData)
      .catch(console.error);
  }, []);
  
  // Persist cart to localStorage on every change
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const categories = useMemo(() => {
    return ["All", ...new Set(productsData.map((p: any) => p.category))];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getDonationDollars = (): number | null => {
    if (donationAmount === "custom") {
      const val = parseFloat(customDonation);
      return isNaN(val) || val < 1 ? null : val;
    }
    return donationAmount;
  };

  const handleDonation = async () => {
    const dollars = getDonationDollars();
    if (!dollars) {
      setDonationError("Please enter a valid amount (minimum $1.00)");
      return;
    }
    setDonationLoading(true);
    setDonationError("");
    try {
      const res = await fetch("/api/create-donation-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: dollars,
          donorName: donorName || undefined,
          donorEmail: donorEmail || undefined,
          message: donorMessage || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setDonationError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setDonationError(err.message || "Failed to connect");
    } finally {
      setDonationLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", data.error);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="bg-maroon py-24 px-6 text-center border-b-4 border-gold relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">Society Selection</h1>
          <p className="text-white/80 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
            Wear your ambition. Official JMPLS merchandise for the modern professional.
          </p>
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </section>

      {/* Shopping Interface */}
      <section className="py-12 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between border-b border-gray-100 pb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search merchandise..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-maroon transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-maroon text-white shadow-md" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group border border-gray-100 flex flex-col hover:shadow-2xl hover:border-maroon/10 transition-all duration-700 bg-white">
              <div className="relative h-80 overflow-hidden bg-gray-50">
                 <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                 />
                 <div className="absolute top-4 left-4 py-1 px-3 bg-white text-[0.6rem] font-bold uppercase tracking-widest text-maroon shadow-sm border border-gray-100">
                    {product.category}
                 </div>
              </div>
              
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors">{product.name}</h3>
                  <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 italic">
                  "{product.description}"
                </p>
                <div className="pt-4 space-y-2">
                  <div className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Details</div>
                  <p className="text-[0.7rem] text-gray-600 line-clamp-2">{product.details}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-[0.65rem] hover:bg-maroon transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                >
                   Add to Cart
                   <ShoppingBag className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="text-gray-300 flex justify-center">
                <Search className="size-12" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-400">No items found</h3>
              <p className="text-gray-400 italic">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>

        {/* Fundraising Section — Inline Donation Form */}
        <div className="mt-32 border-t border-gray-100 pt-24 pb-12">
          <div className="bg-gray-50 rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-xl">
            <div className="lg:w-1/2 p-12 md:p-16 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-maroon/10 text-maroon rounded-full text-[0.6rem] font-bold uppercase tracking-[0.2em]">
                <Heart className="size-3 fill-maroon" />
                Support the Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">JMPLS Fundraising Initiative</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Your contributions directly fund our scholarship programs, law school tour subsidies, and LSAT preparation grants for members. Help us bridge the gap for the next generation of attorneys.
              </p>
              <div className="grid grid-cols-2 gap-8 py-4">
                <div className="space-y-1">
                  <div className="text-maroon font-bold text-3xl font-serif">100%</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold">Direct Impact</div>
                </div>
                <div className="space-y-1">
                  <div className="text-maroon font-bold text-3xl font-serif">Tax</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold">Deductible</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-maroon p-8 md:p-10 flex flex-col justify-start space-y-6 relative overflow-y-auto max-h-[600px]">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-full h-full border-[20px] border-white/20 m-8"></div>
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-white text-2xl font-serif font-bold text-center">Contribute Today</h3>
                <p className="text-white/70 text-sm text-center">Every dollar helps an aspiring legal professional reach their goal.</p>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <p className="text-white/60 text-[0.6rem] font-bold uppercase tracking-widest">Select Amount</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_DONATIONS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setDonationAmount(preset); setCustomDonation(""); setDonationError(""); }}
                        className={`py-3 text-center font-bold text-sm rounded-sm border-2 transition-all ${
                          donationAmount === preset
                            ? "border-white bg-white/20 text-white"
                            : "border-white/20 text-white/80 hover:border-white/50"
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { setDonationAmount("custom"); setDonationError(""); }}
                    className={`w-full py-3 text-center font-bold text-sm rounded-sm border-2 transition-all ${
                      donationAmount === "custom"
                        ? "border-white bg-white/20 text-white"
                        : "border-white/20 text-white/80 hover:border-white/50"
                    }`}
                  >
                    Custom Amount
                  </button>
                  {donationAmount === "custom" && (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Enter amount"
                        value={customDonation}
                        onChange={(e) => { setCustomDonation(e.target.value); setDonationError(""); }}
                        className="w-full pl-8 pr-3 py-3 text-sm font-bold bg-white/10 border-2 border-white rounded-sm focus:outline-none text-white placeholder:text-white/40"
                        autoFocus
                      />
                    </div>
                  )}
                  {donationError && <p className="text-red-300 text-xs flex items-center gap-1.5"><AlertCircle className="size-3.5" />{donationError}</p>}
                </div>

                {/* Donor Info */}
                <div className="space-y-3">
                  <p className="text-white/60 text-[0.6rem] font-bold uppercase tracking-widest">Your Info <span className="font-normal normal-case">(optional)</span></p>
                  <input
                    type="text"
                    placeholder="Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-sm focus:outline-none focus:border-white text-white placeholder:text-white/40"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-sm focus:outline-none focus:border-white text-white placeholder:text-white/40"
                  />
                  <textarea
                    placeholder="Leave a note..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-sm focus:outline-none focus:border-white text-white placeholder:text-white/40 resize-none"
                  />
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonation}
                  disabled={donationLoading}
                  className="w-full py-4 bg-gold text-maroon font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {donationLoading ? (
                    <><svg className="animate-spin size-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
                  ) : (
                    <><Heart className="size-3.5" fill="currentColor" /> Donate ${getDonationDollars()?.toFixed(2) || "0.00"}</>
                  )}
                </button>
                <p className="text-center text-[0.55rem] text-white/40">Secure payment processed by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Drawer (Side) */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white z-[200] shadow-2xl transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-sm transition-colors">
              <X className="size-6 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border border-gray-200 rounded-sm hover:border-maroon transition-colors">
                      <Minus className="size-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border border-gray-200 rounded-sm hover:border-maroon transition-colors">
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <ShoppingBag className="size-12 text-gray-200 mx-auto" />
                <p className="text-gray-400 italic">Your cart is currently empty.</p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-serif font-bold text-gray-900">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest text-center">Shipping calculated at checkout</p>
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-4 bg-maroon text-white font-bold uppercase tracking-widest text-xs hover:bg-maroon/90 shadow-xl transition-all active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Checkout via Stripe
            </button>
          </div>
        </div>
      </div>
      {/* Cart Backdrop */}
      {isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190] animate-in fade-in duration-500"
        />
      )}
    </div>
  );
}
