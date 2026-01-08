import { motion } from "framer-motion";

const Marquee = () => {
  const testimonials = [
    {
      name: "Arjun Mehta",
      username: "@arjungreen",
      avatar: "AM",
      color: "from-purple-500 to-pink-500",
      text: "GreenForge made it so easy to fund my first tree plantation project. Seeing real impact on the blockchain is incredible! 🌳",
    },
    {
      name: "Priya Sharma",
      username: "@priyaeco",
      avatar: "PS",
      color: "from-blue-500 to-cyan-500",
      text: "Just completed my 5th ocean cleanup bounty on @GreenForge. Earning while saving our planet feels amazing! 🌊",
    },
    {
      name: "Rohan Kapoor",
      username: "@rohanimpact",
      avatar: "RK",
      color: "from-green-500 to-emerald-500",
      text: "If you care about the environment and blockchain, @GreenForge is where you need to be. The future is green! 💚",
    },
    {
      name: "Ananya Singh",
      username: "@ananyaclimate",
      avatar: "AS",
      color: "from-orange-500 to-red-500",
      text: "Not gonna lie, funding environmental projects on @GreenForge might just change how I look at crowdfunding forever",
    },
    {
      name: "Vikram Patel",
      username: "@vikramearth",
      avatar: "VP",
      color: "from-indigo-500 to-purple-500",
      text: "Mumbai beach cleanup funded through @GreenForge — blockchain meets real-world impact. This is the future! 🚀",
    },
  ];

  return (
    <div className="bg-black py-16 overflow-hidden">
      <div className="relative flex">
        {/* First set */}
        <motion.div
          className="flex gap-6"
          animate={{
            x: ["-100%", "0%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {testimonial.username}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Second set for seamless loop */}
        <motion.div
          className="flex gap-6 ml-6"
          animate={{
            x: ["-100%", "0%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {testimonial.username}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
