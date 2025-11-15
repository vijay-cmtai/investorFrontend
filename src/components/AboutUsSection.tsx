import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutUsSection: FC = () => {
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "5000+", label: "Happy Clients" },
    { number: "10000+", label: "Properties Sold" },
    { number: "98%", label: "Client Satisfaction" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-background/50 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
            className="order-last lg:order-first relative"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop"
                alt="Modern house exterior"
                className="rounded-2xl shadow-2xl w-full h-[500px] md:h-[600px] object-cover relative z-10 transform group-hover:scale-[1.02] transition-transform duration-300"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-xl z-20">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Years of Trust</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                About Investors Deaal
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Pioneering the Future of{" "}
              <span className="text-primary">Real Estate</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded on the principle of{" "}
              <span className="font-semibold text-foreground">
                "Land to Legacy"
              </span>
              , Investors Deaal is India's premier technology-driven real estate
              platform. We are dedicated to simplifying property transactions
              and empowering clients with data-driven insights.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our curated selection of verified properties, combined with expert
              guidance, ensures a seamless and transparent experience for
              buyers, sellers, and investors alike. We leverage cutting-edge
              technology and market intelligence to help you make informed
              decisions.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={statsVariants}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="px-8 text-lg group shadow-lg hover:shadow-xl transition-shadow"
              >
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
