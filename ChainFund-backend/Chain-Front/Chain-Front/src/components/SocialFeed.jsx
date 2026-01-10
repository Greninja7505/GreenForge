import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

const SocialFeed = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            project: "Ocean Cleanup Initiative",
            author: "Sarah Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            timestamp: "2h ago",
            location: "Mumbai, India",
            content: "Amazing progress today! We removed over 200kg of plastic from Versova Beach. 🌊",
            image: "/images/bounties/beach_cleanup.png",
            likes: 234,
            comments: 45,
            shares: 12,
            liked: false
        },
        {
            id: 2,
            project: "Reforestation Drive",
            author: "Marcus Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
            timestamp: "5h ago",
            location: "Bangalore, India",
            content: "Milestone reached! 🎉 We've planted 1,000 saplings this month. Thank you to all our supporters!",
            image: "/images/bounties/tree_planting.png",
            likes: 567,
            comments: 89,
            shares: 34,
            liked: true
        },
        {
            id: 3,
            project: "Solar Education",
            author: "Elena Rodriguez",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
            timestamp: "1d ago",
            location: "Madrid, Spain",
            content: "Teaching the next generation about renewable energy. The future is bright! ☀️",
            image: "/images/bounties/solar_panels.png",
            likes: 892,
            comments: 120,
            shares: 56,
            liked: false
        },
        {
            id: 4,
            project: "Urban Garden",
            author: "David Kim",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            timestamp: "2d ago",
            location: "Seoul, Korea",
            content: "Our rooftop garden is finally ready for harvest. Fresh veggies for the community! 🥬",
            image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=1000&fit=crop",
            likes: 445,
            comments: 32,
            shares: 8,
            liked: true
        },
        {
            id: 5,
            project: "E-Waste Drive",
            author: "Priya Patel",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
            timestamp: "3d ago",
            location: "London, UK",
            content: "Collected 500+ old laptops for refurbishment. Reducing e-waste one device at a time. 💻",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=1000&fit=crop",
            likes: 321,
            comments: 28,
            shares: 15,
            liked: false
        },
        {
            id: 6,
            project: "Coral Protection",
            author: "James Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
            timestamp: "4d ago",
            location: "Cairns, Australia",
            content: "Monitoring reef health today. The new protection measures seem to be working! 🐠",
            image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=1000&fit=crop",
            likes: 678,
            comments: 95,
            shares: 42,
            liked: true
        }
    ]);

    const handleLike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    return (
        <div className="w-full py-12 bg-black">
            <div className="container-custom max-w-6xl">
                {/* Header - More Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Community Updates
                    </h2>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">
                        See the real-time impact our community is making
                    </p>
                </motion.div>

                {/* Feed - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
                        >
                            {/* Instagram Style Layout */}

                            {/* 1. Header */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.avatar}
                                        alt={post.author}
                                        className="w-8 h-8 rounded-full border border-white/10"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white text-sm font-semibold">{post.author}</h3>
                                            <span className="text-gray-500 text-xs">• {post.timestamp}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400">{post.location}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-white">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                    </div>
                                </button>
                            </div>

                            {/* 2. Image (4:5 Aspect Ratio) */}
                            {post.image && (
                                <div className="relative aspect-[4/5] bg-black/40">
                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* 3. Actions */}
                            <div className="p-4 pb-2">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleLike(post.id)}
                                            className="text-white hover:text-gray-300 transition-colors"
                                        >
                                            <Heart className={`w-6 h-6 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                                        </motion.button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <MessageCircle className="w-6 h-6" />
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Share2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* 4. Likes & Content */}
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-white">{post.likes.toLocaleString()} likes</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <span className="font-semibold text-white mr-2">{post.author}</span>
                                        {post.content}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide pt-1">View all {post.comments} comments</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View More Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-6"
                >
                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        View More Updates
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SocialFeed;
