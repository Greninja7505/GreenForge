import { motion } from "framer-motion";
import {
  MessageCircle,
  Twitter,
  Github,
  FileText,
  Youtube,
  BookOpen,
} from "lucide-react";

const Community = () => {
  const engageLinks = [
    {
      icon: MessageCircle,
      name: "Discord",
      description: "Join our community discussions",
      link: "#",
    },
    {
      icon: MessageCircle,
      name: "Telegram",
      description: "Real-time chat with the community",
      link: "#",
    },
    {
      icon: Github,
      name: "Github",
      description: "Contribute to open source",
      link: "#",
    },
  ];

  const learnLinks = [
    {
      icon: Twitter,
      name: "Twitter",
      description: "Follow for latest updates",
      link: "#",
    },
    {
      icon: FileText,
      name: "Blog",
      description: "Read our latest articles",
      link: "#",
    },
    {
      icon: Youtube,
      name: "YouTube",
      description: "Watch tutorials and demos",
      link: "#",
    },
    {
      icon: BookOpen,
      name: "Documentation",
      description: "Learn how to use the platform",
      link: "#",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 bg-black"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 text-white uppercase tracking-tight">
            JOIN OUR <span className="font-light text-white/40 border-b border-white/10 pb-2">COMMUNITY</span>
          </h1>
          <p className="text-xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
            Building the future of giving together. Connect with changemakers,
            developers, and donors from around the world.
          </p>
        </motion.div>

        {/* Engage Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24"
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-10 text-center">
            ENGAGE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engageLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-black border border-white/10 rounded-2xl p-10 hover:border-white/30 transition-all duration-300 group cursor-pointer shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all">
                  <link.icon className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '400',
                    fontSize: '1.5rem',
                    letterSpacing: '0.02em',
                  }}
                  className="text-white mb-3 uppercase tracking-tight"
                >
                  {link.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '300',
                    fontSize: '0.95rem',
                    letterSpacing: '0.01em',
                    lineHeight: '1.6',
                  }}
                  className="text-white/40 font-light"
                >
                  {link.description}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Learn Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-10 text-center">
            LEARN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learnLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all">
                  <link.icon className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '400',
                    fontSize: '1.25rem',
                    letterSpacing: '0.02em',
                  }}
                  className="text-white mb-2 uppercase tracking-tight"
                >
                  {link.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '300',
                    fontSize: '0.9rem',
                    letterSpacing: '0.01em',
                    lineHeight: '1.6',
                  }}
                  className="text-white/40 font-light"
                >
                  {link.description}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Community;
