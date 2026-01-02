import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  X,
  User,
  Mail,
  Globe,
  Twitter,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useStellar } from "../../context/StellarContext";
import toast from "react-hot-toast";

const ProfileSetupModal = ({ isOpen, onClose }) => {
  const { createProfile, updateProfile, user } = useUser();
  const { publicKey } = useStellar();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    website: user?.website || "",
    twitter: user?.twitter || "",
    location: user?.location || "",
    stellarAddress: user?.stellarAddress || publicKey || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter your name");
      return;
    }

    try {
      if (user) {
        updateProfile(formData);
        toast.success("Profile updated successfully!");
      } else {
        createProfile(formData);
        toast.success("Profile created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border border-white/10 rounded-xl p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-2"
            >
              {user ? "Edit Profile" : "Create Profile"}
            </h2>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "1rem",
              }}
              className="text-gray-400"
            >
              Set up your profile to track donations and create projects
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-3"
              >
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-white/10">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
                <button
                  type="button"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="px-4 py-2 bg-black border border-white/20 text-white rounded-xl hover:border-white/40 transition-all duration-300 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  lineHeight: "1.6",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Stellar Address */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Stellar Wallet Address
              </label>
              <input
                type="text"
                name="stellarAddress"
                value={formData.stellarAddress}
                onChange={handleChange}
                placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Website */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Twitter */}
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="block text-gray-400 mb-2"
              >
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="@yourusername"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="px-6 py-3 bg-black border border-white/10 text-white rounded-xl hover:border-white/30 transition-all duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="px-6 py-3 bg-black border border-white/20 text-white rounded-xl hover:border-white/40 transition-all duration-300"
              >
                {user ? "Update Profile" : "Create Profile"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileSetupModal;
