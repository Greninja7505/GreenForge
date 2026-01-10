import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  MessageCircle,
  FileText,
  Mail,
  Globe,
  Heart,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "All Projects", path: "/projects/all" },
      { name: "Causes", path: "/causes/all" },
      { name: "Create Project", path: "/create-project" },
      { name: "GIVeconomy", path: "/giveconomy" },
    ],
    Community: [
      { name: "Join Community", path: "/join" },
      { name: "About Us", path: "/about" },
      { name: "Onboarding", path: "/onboarding" },
    ],
    Resources: [
      { name: "Documentation", path: "#" },
      { name: "FAQ", path: "#" },
      { name: "Support", path: "#" },
      { name: "API", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "Github" },
    { icon: MessageCircle, href: "#", label: "Discord" },
    { icon: FileText, href: "#", label: "Blog" },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-4">
              <motion.img
                src="/Logo_Text.png"
                alt="GreenForge"
                className="h-16 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
                lineHeight: "1.6",
              }}
              className="text-gray-400 mb-5 max-w-md"
            >
              Empowering changemakers through{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">blockchain-powered environmental crowdfunding</span>{" "}
              on the Stellar network. Building the future of giving with transparency,
              security, and global accessibility.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4 uppercase"
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.9rem",
                        letterSpacing: "0.01em",
                      }}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.1rem",
                  letterSpacing: "0.02em",
                }}
                className="text-white mb-1"
              >
                Stay Updated
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.85rem",
                  letterSpacing: "0.01em",
                }}
                className="text-gray-400"
              >
                Subscribe to our newsletter for the latest updates
              </p>
            </div>

            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.85rem",
                    letterSpacing: "0.01em",
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg uppercase transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/25 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.8rem",
              letterSpacing: "0.01em",
            }}
            className="text-gray-400"
          >
            © 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">GreenForge</span>. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Link
              to="#"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.8rem",
                letterSpacing: "0.01em",
              }}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.8rem",
                letterSpacing: "0.01em",
              }}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.8rem",
                letterSpacing: "0.01em",
              }}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Cookies
            </Link>
          </div>

          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.8rem",
              letterSpacing: "0.01em",
            }}
            className="flex items-center space-x-1.5 text-gray-400"
          >
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-green-500 fill-current" />
            <span>for changemakers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
