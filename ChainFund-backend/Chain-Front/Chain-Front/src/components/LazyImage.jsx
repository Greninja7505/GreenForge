import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LazyImage = ({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  fallback = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Skeleton */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-800 animate-pulse ${placeholderClassName}`}
        />
      )}

      {/* Error Fallback */}
      {error && fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          {fallback}
        </div>
      )}

      {/* Actual Image */}
      {isInView && !error && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${className}`}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
