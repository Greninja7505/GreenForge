import { motion } from "framer-motion";

const Marquee = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      username: "@alexdev",
      avatar: "AC",
      color: "from-purple-500 to-pink-500",
      text: "Building on Stellar feels smoother than any all-nighter I've pulled. Catch me experimenting at @0xGenIgnite with @stellar.india",
    },
    {
      name: "Maya Patel",
      username: "@mayabuilds",
      avatar: "MP",
      color: "from-blue-500 to-cyan-500",
      text: "Honestly, @stellar.india makes Web3 feel simple again. Can't wait to see what we end up building at @0xGenIgnite",
    },
    {
      name: "Jordan Lee",
      username: "@jordantech",
      avatar: "JL",
      color: "from-green-500 to-emerald-500",
      text: "If innovation had a chain, it would be Stellar. Let's see how far we can push it at @0xGenIgnite with @stellar.india",
    },
    {
      name: "Priya Sharma",
      username: "@priyacodes",
      avatar: "PS",
      color: "from-orange-500 to-red-500",
      text: "Not gonna lie, building on @stellar.india during @0xGenIgnite might just change how I look at blockchain forever",
    },
    {
      name: "Sam Torres",
      username: "@samtechie",
      avatar: "ST",
      color: "from-indigo-500 to-purple-500",
      text: "Goa, code, and @stellar.india — that's my kind of weekend. Excited for what's coming at @0xGenIgnite",
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
