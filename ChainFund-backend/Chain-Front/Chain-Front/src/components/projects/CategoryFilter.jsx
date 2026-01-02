import { motion } from "framer-motion";
import {
  Globe,
  Sun,
  Waves,
  Leaf,
  Cloud,
  Bird,
  Truck,
  Recycle,
  Building,
} from "lucide-react";
import { getCategoryOptions } from "../../utils/categories";

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { id: "all", name: "All Projects", icon: Globe },
    ...getCategoryOptions().map((cat, index) => ({
      id: cat.value,
      name: cat.label,
      icon: [Sun, Waves, Leaf, Cloud, Bird, Truck, Recycle, Building][index] || Globe,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category.id)}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: selectedCategory === category.id ? "400" : "300",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${selectedCategory === category.id
              ? "bg-black border-2 border-white text-white shadow-lg"
              : "bg-black border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
        >
          <category.icon className="w-5 h-5" strokeWidth={1.5} />
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
