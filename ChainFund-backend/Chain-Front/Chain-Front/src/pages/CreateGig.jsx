import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  DollarSign,
  Clock,
  Tag,
  ArrowRight,
  Sparkles,
  Plus,
  X
} from "lucide-react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

const categories = [
  "Smart Contract Development",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Blockchain Consulting",
  "Security Auditing",
  "Documentation",
  "Marketing",
  "Community Management",
  "Other"
];

const CreateGig = () => {
  const navigate = useNavigate();
  const { user, canAccess } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    skills: [],
    newSkill: ""
  });

  // Check if user can create gigs
  if (!canAccess('freelancer')) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Freelancer Access Required</h2>
          <p className="text-gray-400 mb-6">You need to be a freelancer to create gigs.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Update Your Role
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill.trim()],
        newSkill: ""
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.deliveryTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new gig object
      const newGig = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        deliveryTime: parseInt(formData.deliveryTime),
        createdBy: user?.id,
        creatorName: user?.name || "Anonymous",
        createdAt: new Date().toISOString(),
        status: "active",
        orders: 0,
        rating: 0,
        reviews: []
      };

      // Save to localStorage (in production, this would be an API call)
      const existingGigs = JSON.parse(localStorage.getItem("freelancer_gigs") || "[]");
      existingGigs.push(newGig);
      localStorage.setItem("freelancer_gigs", JSON.stringify(existingGigs));

      toast.success("Gig created successfully!");
      navigate("/freelancer/gigs");
    } catch (error) {
      console.error("Error creating gig:", error);
      toast.error("Failed to create gig. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create a New <span className="text-white">Gig</span>
          </h1>
          <p className="text-xl text-gray-400">
            Offer your skills to projects in the ecosystem
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-800 border border-white/10 rounded-2xl p-8"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">Gig Title *</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="I will develop smart contracts for your DeFi project"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">Category *</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your gig in detail. What will you deliver? What makes you qualified?"
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* Price and Delivery Time */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Price (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="500"
                  min="1"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Delivery Time (days) *</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="7"
                  min="1"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <label className="block text-gray-400 mb-2 font-medium">Skills & Technologies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                name="newSkill"
                value={formData.newSkill}
                onChange={handleChange}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g., Solidity, React)"
                className="flex-1 bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Gig
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default CreateGig;
