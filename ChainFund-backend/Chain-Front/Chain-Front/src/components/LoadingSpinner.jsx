import { motion } from "framer-motion";

// Full Page Loading Spinner
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 border-2 border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-transparent border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Message */}
        <p
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "300",
            fontSize: "0.95rem",
          }}
          className="text-gray-400"
        >
          {message}
        </p>
      </motion.div>
    </div>
  );
};

// Inline Loading Spinner
export const InlineLoader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 border-2 border-white/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 border-2 border-transparent border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Skeleton Loader for Cards
export const CardSkeleton = () => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-800" />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-800 rounded w-1/4" />
        <div className="h-6 bg-gray-800 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-800 rounded w-5/6" />
        </div>
        <div className="flex justify-between pt-4">
          <div className="h-8 bg-gray-800 rounded w-1/3" />
          <div className="h-8 bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for List Items
export const ListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
          </div>
          <div className="h-8 bg-gray-800 rounded w-20" />
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5">
      {/* Header */}
      <div className="bg-[#1a1a1a] px-6 py-4 border-b border-white/5">
        <div className="flex space-x-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-800 rounded flex-1 animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 border-b border-white/5 last:border-0"
        >
          <div className="flex space-x-4">
            {[...Array(cols)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-800 rounded flex-1 animate-pulse"
                style={{ animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Button Loading State
export const ButtonLoader = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <motion.div
        className="w-2 h-2 bg-current rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-current rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-current rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

export default PageLoader;
