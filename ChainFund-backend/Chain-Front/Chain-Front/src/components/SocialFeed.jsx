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
            timestamp: "2 hours ago",
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
            timestamp: "5 hours ago",
            location: "Bangalore, India",
            content: "Milestone reached! 🎉 We've planted 1,000 saplings this month. Thank you to all our supporters!",
            image: "/images/bounties/tree_planting.png",
            likes: 567,
            comments: 89,
            shares: 34,
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
            <div className="container-custom max-w-3xl">
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

                {/* Feed - Compact */}
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
                        >
                            {/* Post Header - Compact */}
                            <div className="p-4 pb-3">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={post.avatar}
                                            alt={post.author}
                                            className="w-10 h-10 rounded-full border-2 border-white/20"
                                        />
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">{post.author}</h3>
                                            <p className="text-xs text-gray-400">{post.project}</p>
                                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                                                <span className="flex items-center gap-0.5">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {post.timestamp}
                                                </span>
                                                <span className="flex items-center gap-0.5">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {post.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content - Compact */}
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    {post.content}
                                </p>
                            </div>

                            {/* Post Image - Smaller aspect ratio */}
                            {post.image && (
                                <div className="relative aspect-[16/9] bg-black/40 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            {/* Post Actions - Compact */}
                            <div className="p-4 pt-3">
                                <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                                    <span>{post.likes} likes</span>
                                    <div className="flex items-center gap-3">
                                        <span>{post.comments} comments</span>
                                        <span>{post.shares} shares</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-3 border-t border-white/10">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleLike(post.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${post.liked
                                                ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                                        <span>Like</span>
                                    </motion.button>

                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Comment</span>
                                    </button>

                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
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
