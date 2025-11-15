import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Data for team members
const teamMembers = [
  {
    name: "Manish Tiwari",
    role: "Founder",
    img: "/foundermain.jpg",
  },
  {
    name: "Rashmin Rana",
    role: "Cofounder",
    img: "/founder2-.png",
  },
  {
    name: "Anurag Singh",
    role: "Tech Expert",
    img: "https://cdn.pixabay.com/photo/2023/06/16/15/10/man-8068201_1280.jpg",
  },
  {
    name: "Vijay",
    role: "Development Team",
    img: "/vijay.jpg",
  },
];

// Team Member Card Component
const TeamMemberCard: FC<{
  name: string;
  role: string;
  img: string;
  delay: number;
}> = ({ name, role, img, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="text-center group transition-all duration-500"
    >
      <div className="relative w-full h-64 mx-auto mb-3 overflow-hidden rounded-xl border-2 border-white/10 hover:border-red-400/50 transition-all duration-300">
        <motion.img
          src={img}
          alt={name}
          className="w-full h-full object-cover object-[center_20%]"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <motion.h3
        className="text-base font-bold text-white"
        whileHover={{ scale: 1.05 }}
      >
        {name}
      </motion.h3>
      <p className="text-red-400 text-xs font-medium">{role}</p>
    </motion.div>
  );
};

// Team Section Component
const TeamSection: FC = () => {
  return (
    <section
      className="py-16 sm:py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 items-center">
          <TeamMemberCard {...teamMembers[0]} delay={0} />

          {/* Center Title */}
          <motion.div
            className="text-center px-4 order-first md:order-none col-span-1 md:col-start-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-3"
            >
              <p className="text-xs font-semibold text-red-400 tracking-widest uppercase bg-red-500/20 px-3 py-1.5 rounded-full border border-red-400/30 backdrop-blur-sm">
                TEAM MEMBERS
              </p>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-3 relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Meet Our Team
              <motion.div
                className="absolute left-0 right-0 -bottom-2 h-[2px] bg-gradient-to-r from-red-500 to-orange-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.h2>

            <motion.p
              className="text-white/70 mt-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              A dynamic team of real estate experts, marketers, and mentors
              dedicated to driving growth for realtors, brokers, and developers.
            </motion.p>
          </motion.div>

          <TeamMemberCard {...teamMembers[1]} delay={200} />
          <TeamMemberCard {...teamMembers[2]} delay={300} />

          {/* Property Image */}
          <motion.div
            className="transition-all duration-500"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <div className="relative w-full h-64 overflow-hidden rounded-xl border-2 border-white/10 hover:border-orange-400/50 transition-all duration-300 group">
              <motion.img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop"
                alt="Modern Villa"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <motion.div
                className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <p className="text-white text-sm font-semibold">
                  Modern Architecture
                </p>
                <p className="text-white/70 text-xs">Our Premium Projects</p>
              </motion.div>
            </div>
          </motion.div>

          <TeamMemberCard {...teamMembers[3]} delay={500} />
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
