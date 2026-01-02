import { motion } from "framer-motion";
import { Monitor, Wallet, Mail, ArrowRight } from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: Monitor,
      title: "Technical Support",
      description:
        "Assistance with app functionality, card activation, and troubleshooting.",
      label: "CONTACT NOW",
    },
    {
      icon: Wallet,
      title: "Financial Support",
      description:
        "Help with transaction limits, fees, balances, and financial inquiries.",
      label: "CONTACT NOW",
    },
    {
      icon: Mail,
      title: "General Inquiries",
      description:
        "For general inquiries about Crypture, including our products and services.",
      label: "CONTACT NOW",
    },
  ];

  return (
    <section className="section-padding bg-black">
      <div className="container-custom max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6"
          >
            NEED HELP?
            <br />
            <span style={{ fontWeight: "400" }}>GET IN TOUCH!</span>
          </h2>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            className="text-gray-500 max-w-md"
          >
            Contact our dedicated support team for quick and reliable
            assistance. We're here to help you every step of the way!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300 group"
            >
              <div className="mb-8">
                <feature.icon
                  className="w-12 h-12 text-white/80 mb-6"
                  strokeWidth={1.5}
                />

                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.5rem",
                    letterSpacing: "0.02em",
                  }}
                  className="text-white mb-4"
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.95rem",
                    letterSpacing: "0.01em",
                    lineHeight: "1.6",
                  }}
                  className="text-gray-500 mb-8"
                >
                  {feature.description}
                </p>
              </div>

              <button
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                }}
                className="flex items-center space-x-2 text-white group-hover:text-gray-300 transition-colors uppercase"
              >
                <span>{feature.label}</span>
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
