import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Filter, Search, ShoppingBag, Leaf, ExternalLink, Zap, Info, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/marketplace/products');
            const mappedData = data.map(p => ({
                ...p,
                // Map backend fields to frontend expectations
                cashback: p.price * (p.cashback_percentage || 0) / 100, // Explicitly calculate cashback amount
                promo: p.reviews_count > 10 ? "Top Seller" : null
            }));
            setProducts(mappedData);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Using offline mode for marketplace");
            // Fallback mock data with expanded products
            setProducts([
                // Tech Products
                {
                    id: 1, name: "Solar Phone Charger", price: 45, cashback: 8,
                    image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800",
                    category: "Tech", promo: "Top Seller"
                },
                {
                    id: 2, name: "Eco Smart Watch", price: 129, cashback: 15,
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
                    category: "Tech"
                },
                {
                    id: 3, name: "Bamboo Wireless Keyboard", price: 65, cashback: 10,
                    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800",
                    category: "Tech"
                },
                {
                    id: 4, name: "Recycled Laptop Stand", price: 35, cashback: 5,
                    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
                    category: "Tech"
                },
                {
                    id: 5, name: "Solar Power Bank 20000mAh", price: 55, cashback: 9,
                    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800",
                    category: "Tech", promo: "New"
                },
                // Fashion Products
                {
                    id: 6, name: "Organic Cotton T-Shirt", price: 35, cashback: 4,
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
                    category: "Fashion"
                },
                {
                    id: 7, name: "Recycled Denim Jacket", price: 89, cashback: 12,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800",
                    category: "Fashion", promo: "Top Seller"
                },
                {
                    id: 8, name: "Hemp Sneakers", price: 95, cashback: 14,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800",
                    category: "Fashion"
                },
                {
                    id: 9, name: "Eco Bamboo Sunglasses", price: 45, cashback: 6,
                    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800",
                    category: "Fashion"
                },
                {
                    id: 10, name: "Cork Leather Wallet", price: 55, cashback: 7,
                    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800",
                    category: "Fashion", promo: "New"
                },
                // Home Products
                {
                    id: 11, name: "Bamboo Toothbrush Set", price: 15, cashback: 2,
                    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?q=80&w=800",
                    category: "Home"
                },
                {
                    id: 12, name: "Reusable Beeswax Wraps", price: 22, cashback: 3,
                    image: "https://images.unsplash.com/photo-1591079406020-7a4c8b3489e4?q=80&w=800",
                    category: "Home"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
        toast.success(`Aded ${product.name} to cart`);
    };

    const handleCheckout = async () => {
        try {
            // Process each item in cart
            let totalCashback = 0;
            let totalOffset = 0;

            for (const item of cart) {
                const result = await api.post('/api/marketplace/buy', {
                    product_id: item.id,
                    quantity: 1
                });
                totalCashback += result.cashback_earned || 0;
                totalOffset += result.carbon_offset || 0;
            }

            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-black border border-green-500 rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Leaf className="h-10 w-10 text-green-500" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">
                                    Purchase Successful!
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    You earned <b className="text-green-400">{totalCashback.toFixed(2)} CCT</b> and offset <b className="text-green-400">{totalOffset}kg CO2</b>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ));
            setCart([]);
        } catch (error) {
            toast.error(error.message || "Checkout failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-green-500" />
                    <p>Loading marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-20"
        >
            <div className="container-custom">

                {/* Header - Enhanced with Photo */}
                <div className="relative rounded-3xl overflow-hidden mb-16 border border-white/10 group">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop"
                            alt="Sustainable Markeplace"
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    </div>

                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row justify-between items-end">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                                <Leaf className="w-3 h-3" /> Carbon Neutral Shopping
                            </div>
                            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 uppercase tracking-tighter">
                                Carbon Cashback
                            </h1>
                            <p className="text-gray-300 text-lg font-light max-w-xl">
                                Shop <span className="text-white font-medium">verified sustainable products</span>. Earn <span className="text-green-400 font-medium">Carbon Credit Tokens (CCT)</span> for every purchase to offset your footprint.
                            </p>
                        </div>

                        <div className="flex bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-1 mt-6 md:mt-0">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === "All" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                            >All</button>
                            <button
                                onClick={() => setSelectedCategory("Tech")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === "Tech" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                            >Tech</button>
                            <button
                                onClick={() => setSelectedCategory("Fashion")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === "Fashion" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                            >Fashion</button>
                        </div>
                    </div>
                </div>

                {/* Stats & Trust */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                        <h3 className="text-3xl font-light text-green-400 mb-1">100%</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Verified Green</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                        <h3 className="text-3xl font-light text-white mb-1">50k+</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Trees Planted</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                        <h3 className="text-3xl font-light text-white mb-1">2.4M</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Plastic Removed</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                        <h3 className="text-3xl font-light text-white mb-1">Zero</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Carbon Shipping</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products
                        .filter(p => selectedCategory === "All" || p.category === selectedCategory)
                        .map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -5 }}
                                className="group bg-black border border-white/10 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    {product.promo && (
                                        <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
                                            {product.promo}
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/10 group-hover:border-green-500/50 transition-colors">
                                        <Leaf className="w-4 h-4 text-green-400" />
                                    </div>

                                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-green-400 text-xs font-mono px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1 shadow-lg">
                                        <Zap className="w-3 h-3" />
                                        Earn {product.cashback} CCT
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg text-white font-medium mb-1">{product.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
                                        </div>
                                        <div className="text-xl font-light text-white">
                                            ${product.price}
                                        </div>
                                    </div>

                                    {/* Impact Metric */}
                                    <div className="mb-6 py-2 px-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Impact Score</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-1.5 h-6 rounded-full ${i <= 4 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all flex items-center justify-center gap-2 group-hover:bg-green-600 group-hover:border-green-500 group-hover:text-black font-medium overflow-hidden relative"
                                    >
                                        <span className="relative z-10 flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Add to Cart</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Cart Floating Action Button (Mock) */}
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 rounded-full py-3 px-6 shadow-2xl z-50 flex items-center gap-6 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                            <span className="bg-white text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {cart.length}
                            </span>
                            <span className="text-sm text-white">
                                Total Cashback: <span className="text-green-400">{cart.reduce((a, b) => a + b.cashback, 0)} CCT</span>
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full text-sm font-bold transition-colors"
                        >
                            Checkout
                        </button>
                    </motion.div>
                )}

                {/* How it Works Section */}
                <div className="mt-20 border-t border-white/10 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white">1</div>
                            <h3 className="text-white font-medium mb-2">Shop Green</h3>
                            <p className="text-gray-400 text-sm">Purchase eco-friendly products verified by GreenForge.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 text-green-400">2</div>
                            <h3 className="text-white font-medium mb-2">Earn Tokens</h3>
                            <p className="text-gray-400 text-sm">Receive Carbon Credit Tokens (CCT) based on environmental impact.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white">3</div>
                            <h3 className="text-white font-medium mb-2">Offset</h3>
                            <p className="text-gray-400 text-sm">Use CCT to offset your footprint or trade on the GIVeconomy.</p>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default Marketplace;
