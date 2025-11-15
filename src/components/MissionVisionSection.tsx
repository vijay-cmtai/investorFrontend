import { FC } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Rocket,
  TrendingUp,
  Users,
  Award,
  Building2,
  Shield,
} from "lucide-react";

const MissionVisionSection: FC = () => {
  return (
    <section
      className="py-20 sm:py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
      }}
    >
      {/* Animated Stars/Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-400/30 mb-4 backdrop-blur-sm"
          >
            <Rocket className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">
              OUR FOUNDATION
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Mission & Vision
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Building India's most innovative real estate ecosystem with
            transparency, technology, and trust at its core
          </p>
        </motion.div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0 }}
            whileHover={{ y: -10 }}
            className="group bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <motion.img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                alt="Our Mission"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                whileHover={{ rotate: 360 }}
                className="absolute bottom-4 left-4 p-3 bg-red-600 rounded-xl shadow-lg"
              >
                <Target className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Our Mission
              </h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                To{" "}
                <span className="text-red-400 font-semibold">
                  revolutionize
                </span>{" "}
                the Indian real estate market through cutting-edge technology,
                unwavering transparency, and absolute trust—making property
                investment accessible, profitable, and seamless for everyone.
              </p>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-3"
                >
                  <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Democratizing real estate investment with tech-driven
                    solutions
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-3"
                >
                  <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Ensuring 100% transparency in every transaction
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start gap-3"
                >
                  <Users className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Empowering investors with data-driven insights
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="group bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <motion.img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Our Vision"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.7 }}
                whileHover={{ rotate: 360 }}
                className="absolute bottom-4 left-4 p-3 bg-orange-600 rounded-xl shadow-lg"
              >
                <Eye className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Our Vision
              </h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                To become{" "}
                <span className="text-orange-400 font-semibold">
                  India's #1 trusted
                </span>{" "}
                and most comprehensive real estate ecosystem, creating lasting
                value, building generational wealth, and establishing legacies
                for our clients, partners, and communities.
              </p>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start gap-3"
                >
                  <Building2 className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Building a comprehensive property ecosystem across India
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                  className="flex items-start gap-3"
                >
                  <Award className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Setting industry standards for excellence and integrity
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 }}
                  className="flex items-start gap-3"
                >
                  <Users className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Creating lasting impact for investors and communities
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            { value: "10K+", label: "Happy Clients", icon: Users },
            { value: "500+", label: "Properties Listed", icon: Building2 },
            { value: "₹1000Cr+", label: "Worth Transacted", icon: TrendingUp },
            { value: "50+", label: "Cities Covered", icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-red-400/50 transition-all duration-300 text-center cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <stat.icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
              </motion.div>
              <div className="text-3xl font-bold mb-1 text-white">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
