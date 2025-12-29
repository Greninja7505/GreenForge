import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Globe, Shield, Linkedin } from "lucide-react";
import parthImg from "../teams/parth.png";
import chirayuImg from "../teams/chirayu.jpg";
import gauravImg from "../teams/gaurav.jpg";
import suhailImg from "../teams/suhail.jpg";
import adityaImg from "../teams/aditya.jpg";

const About = () => {
  const values = [
    {
      icon: Globe,
      title: "Decentralization",
      description: "Empowering communities through blockchain technology",
    },
    {
      icon: Heart,
      title: "Transparency",
      description: "Open and verifiable transactions on-chain",
    },
    {
      icon: Users,
      title: "Innovation",
      description: "Building cutting-edge DeFi infrastructure",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Audited smart contracts and secure protocols",
    },
  ];

  const team = [
    {
      name: "Parth Parmar",
      role: "AI/ML Engineer",
      description: "Leading AI and machine learning initiatives, focusing on intelligent blockchain analytics and predictive modeling for DeFi optimization.",
      linkedin: "https://www.linkedin.com/in/parthparmar04/",
      image: parthImg
    },
    {
      name: "Chirayu Marathe",
      role: "Full-Stack Developer",
      description: "Expert frontend developer with strong backend skills, specializing in creating seamless user experiences and robust blockchain applications.",
      linkedin: "https://www.linkedin.com/in/chirayu-marathe69/",
      image: chirayuImg
    },
    {
      name: "Gaurav Patil",
      role: "GenAI & Deep Learning Engineer",
      description: "GenAI and deep learning practitioner working on agentic AI use cases and high-impact, efficient LLM pipelines; hands-on coder specializing in rapid prototyping.",
      linkedin: "https://www.linkedin.com/in/gauravpatil2515/",
      image: gauravImg
    },
    {
      name: "Suhail Shaikh",
      role: "Data Scientist",
      description: "Data scientist specializing in blockchain analytics, predictive modeling, and extracting actionable insights from decentralized finance data.",
      linkedin: "https://www.linkedin.com/in/suhail-shaikh-378897283/",
      image: suhailImg
    },
    {
      name: "Aditya Mishra",
      role: "Research Engineer",
      description: "Research engineer focused on exploring emerging technologies, conducting technical research, and developing innovative solutions for blockchain challenges.",
      linkedin: "https://www.linkedin.com/in/aditya-mishra-878ba4212/",
      image: adityaImg
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 bg-black"
    >
      <div className="container-custom max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6 uppercase tracking-tight"
          >
            ABOUT <span className="font-light text-white/40">STELLAR FORGE</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1.25rem",
              letterSpacing: "0.01em",
            }}
            className="text-white/40 font-light"
          >
            Empowering blockchain innovation through transparent crowdfunding and decentralized giving
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black border border-white/10 rounded-2xl p-10 hover:border-white/30 transition-all duration-300 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Target className="w-10 h-10 text-white/60" strokeWidth={1} />
            </div>
            <div className="text-center md:text-left">
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.75rem",
                  letterSpacing: "0.02em",
                }}
                className="text-white mb-4 uppercase tracking-tight"
              >
                Our Mission
              </h2>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "1.125rem",
                  letterSpacing: "0.01em",
                  lineHeight: "1.8",
                }}
                className="text-white/40 font-light"
              >
                Stellar Forge is revolutionizing blockchain crowdfunding by connecting innovative projects with global supporters through transparent, decentralized giving. We provide a secure platform where verified projects can raise funds for sustainable development, emerging technologies, and social impact initiatives, all powered by Stellar's efficient blockchain infrastructure.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-black border border-white/10 rounded-2xl p-10 hover:border-white/30 transition-all duration-300 mb-24 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Eye className="w-10 h-10 text-white/60" strokeWidth={1} />
            </div>
            <div className="text-center md:text-left">
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.75rem",
                  letterSpacing: "0.02em",
                }}
                className="text-white mb-4 uppercase tracking-tight"
              >
                Our Vision
              </h2>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "1.125rem",
                  letterSpacing: "0.01em",
                  lineHeight: "1.8",
                }}
                className="text-white/40 font-light"
              >
                We envision a world where blockchain crowdfunding empowers every innovative project to access global funding transparently and efficiently. Where supporters can directly fund real-world impact in sustainable development, education, healthcare, and emerging technologies. Where decentralized giving creates lasting positive change without intermediaries or barriers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2
            className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-12 text-center"
          >
            OUR CORE VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-black border border-white/10 rounded-2xl p-10 hover:border-white/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8">
                  <value.icon
                    className="w-7 h-7 text-white/60"
                    strokeWidth={1}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.5rem",
                    letterSpacing: "0.02em",
                  }}
                  className="mb-4 text-white uppercase tracking-tight"
                >
                  {value.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "1rem",
                    letterSpacing: "0.01em",
                    lineHeight: "1.6",
                  }}
                  className="text-white/40 font-light"
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meet the Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-32"
        >
          <h2
            className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-16 text-center"
          >
            THE ARCHITECTS
          </h2>
          <div className="flex flex-col items-center space-y-8">
            {/* First row - 2 members */}
            <div className="flex flex-wrap justify-center gap-8">
              {team.slice(0, 2).map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -10 }}
                  className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 text-center w-80 shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-white/5 group-hover:border-white/30 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.25rem",
                      letterSpacing: "0.02em",
                    }}
                    className="text-white mb-2 uppercase tracking-tight"
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                    className="text-white/60 mb-4"
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.6",
                    }}
                    className="text-white/30 mb-6 font-light min-h-[100px]"
                  >
                    {member.description}
                  </p>
                  {member.linkedin !== "#" && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-white/20 hover:text-white transition-all duration-300"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Second row - 3 members */}
            <div className="flex flex-wrap justify-center gap-8">
              {team.slice(2, 5).map((member, index) => (
                <motion.div
                  key={index + 2}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 2) }}
                  whileHover={{ y: -10 }}
                  className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 text-center w-80 shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-white/5 group-hover:border-white/30 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.25rem",
                      letterSpacing: "0.02em",
                    }}
                    className="text-white mb-2 uppercase tracking-tight"
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                    className="text-white/60 mb-4"
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.6",
                    }}
                    className="text-white/30 mb-6 font-light min-h-[100px]"
                  >
                    {member.description}
                  </p>
                  {member.linkedin !== "#" && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-white/20 hover:text-white transition-all duration-300"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
