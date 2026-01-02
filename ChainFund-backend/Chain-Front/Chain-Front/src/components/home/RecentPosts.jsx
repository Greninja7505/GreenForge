import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch recent blog posts from Giveth RSS feed
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://blog.giveth.io/feed"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setPosts(data.items.slice(0, 3)); // Top 3 posts
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 relative">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading recent posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null; // Don't show section if there's an error
  }

  return (
    <section className="py-20 relative">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
            className="text-white mb-4"
          >
            Recent Posts
          </h2>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1.1rem",
              letterSpacing: "0.01em",
            }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Latest updates from the Giveth community
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            // Extract first image from content if available
            const imgMatch = post.content?.match(/<img[^>]+src="([^">]+)"/);
            const thumbnail = post.thumbnail || (imgMatch ? imgMatch[1] : null);

            // Strip HTML from description
            const description =
              post.description?.replace(/<[^>]+>/g, "").substring(0, 150) +
              "...";

            // Format date
            const postDate = new Date(post.pubDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );

            return (
              <motion.a
                key={post.guid}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 group"
              >
                {/* Post Thumbnail */}
                {thumbnail && (
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <img
                      src={thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.85rem",
                      }}
                    >
                      {postDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.25rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.4",
                    }}
                    className="text-white mb-3 group-hover:text-gray-300 transition-colors"
                  >
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.6",
                    }}
                    className="text-gray-500 mb-4"
                  >
                    {description}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "0.9rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Read More
                    </span>
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* View All Posts Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://blog.giveth.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 group"
          >
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="text-white"
            >
              Visit Blog
            </span>
            <ArrowRight
              className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentPosts;
