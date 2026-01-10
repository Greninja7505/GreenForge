import { motion } from "framer-motion";

export function Iphone17Pro({
  src,
  width = 433,
  height = 882,
  className = "",
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
      style={{ perspective: "1000px" }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 433 882"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M2 73C2 32.6832 34.6832 0 75 0H358C398.317 0 431 32.6832 431 73V809C431 849.317 398.317 882 358 882H75C34.6832 882 2 849.317 2 809V73Z"
          className="fill-[#1a1a1a]"
        />
        <path
          d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
          className="fill-[#2a2a2a]"
        />
        <path
          d="M1 234C1 233.448 1.44772 233 2 233H3.5V290H2C1.44772 290 1 289.552 1 289V234Z"
          className="fill-[#2a2a2a]"
        />
        <path
          d="M1 304C1 303.448 1.44772 303 2 303H3.5V360H2C1.44772 360 1 359.552 1 359V304Z"
          className="fill-[#2a2a2a]"
        />
        <path
          d="M430 279C430 278.448 430.448 278 431 278H432C432.552 278 433 278.448 433 279V384C433 384.552 432.552 385 432 385H431C430.448 385 430 384.552 430 384V279Z"
          className="fill-[#2a2a2a]"
        />
        <path
          d="M6 74C6 35.3401 37.3401 4 76 4H357C395.66 4 427 35.3401 427 74V808C427 846.66 395.66 878 357 878H76C37.3401 878 6 846.66 6 808V74Z"
          className="fill-[#0a0a0a]"
        />
        <path
          d="M21.25 75C21.25 43.5198 46.7698 18 78.25 18H354.75C386.23 18 411.75 43.5198 411.75 75V807C411.75 838.48 386.23 864 354.75 864H78.25C46.7698 864 21.25 838.48 21.25 807V75Z"
          className="fill-black"
        />
        
        {/* Screen content */}
        <foreignObject x="21.25" y="18" width="390.5" height="846" clipPath="url(#screenClip)">
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "40px",
            }}
          >
            <img
              src={src}
              alt="App Screenshot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </foreignObject>

        {/* Dynamic Island */}
        <path
          d="M154 33C154 24.7157 160.716 18 169 18H264C272.284 18 279 24.7157 279 33V33C279 41.2843 272.284 48 264 48H169C160.716 48 154 41.2843 154 33V33Z"
          className="fill-[#0a0a0a]"
        />
        
        {/* Screen border highlight */}
        <path
          d="M21.25 75C21.25 43.5198 46.7698 18 78.25 18H354.75C386.23 18 411.75 43.5198 411.75 75V807C411.75 838.48 386.23 864 354.75 864H78.25C46.7698 864 21.25 838.48 21.25 807V75Z"
          stroke="url(#screenGlow)"
          strokeWidth="0.5"
          fill="none"
        />
        
        <defs>
          <clipPath id="screenClip">
            <rect x="21.25" y="18" width="390.5" height="846" rx="40" />
          </clipPath>
          <linearGradient id="screenGlow" x1="216.5" y1="18" x2="216.5" y2="864" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22c55e" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="1" stopColor="#22c55e" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-b from-green-500/20 via-emerald-500/10 to-transparent" />
    </motion.div>
  );
}

export default Iphone17Pro;
