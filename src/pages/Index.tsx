import React, { FC } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Award,
  TrendingUp,
  Quote,
  ArrowRight,
  Home,
  Building,
  Warehouse,
  SquareStack,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProperties } from "@/redux/features/properties/propertySlice";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import AboutUsSection from "@/components/AboutUsSection";
import MissionVisionSection from "@/components/MissionVisionSection";
import TeamSection from "@/components/TeamSection";

const PropertyCardSkeleton: FC = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="h-52 bg-muted"></div>
    <CardContent className="p-4 space-y-3">
      <div className="h-5 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="flex justify-between items-center pt-3 mt-2 border-t">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="h-8 w-8 bg-muted rounded-full"></div>
      </div>
    </CardContent>
  </Card>
);

const Index: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { properties, isLoading } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  React.useEffect(() => {
    dispatch(getProperties({ isFeatured: true, limit: 6 }));
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to save properties to your wishlist.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/properties?type=${category}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cityData = [
    {
      city: "Mumbai",
      img: "https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      city: "Delhi",
      img: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      className: "",
    },
    {
      city: "Bangalore",
      img: "https://s7ap1.scene7.com/is/image/incredibleindia/vidhana-soudha-bangalore-karnataka-hero?qlt=82&ts=1742199603184",
      className: "",
    },
  ];

  const testimonials = [
    {
      name: "Rohan & Priya",
      city: "Mumbai",
      quote:
        "Investors Deaal made our dream of owning a home in Mumbai a reality. The process was so smooth and transparent. Highly recommended!",
    },
    {
      name: "Amit Singh",
      city: "Delhi",
      quote:
        "Found the perfect office space for my startup through this platform. The expert guidance and verified listings were invaluable.",
    },
    {
      name: "Sneha Reddy",
      city: "Bangalore",
      quote:
        "As a first-time investor, I was nervous. The market insights provided by Investors Deaal helped me make a confident and profitable decision.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION */}
      <section
        className="relative text-white pt-28 pb-20 min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants}>
            <img
              src="/investor-logo.png"
              alt="Investors Deaal Logo"
              className="w-24 h-auto mx-auto mb-4"
            />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          >
            Investors Deaal
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 mb-6 font-light tracking-widest"
          >
            Land to Legacy
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-3xl mb-10"
          >
            India's <span className="font-semibold text-white">1st</span> Real
            Estate technology-based platform.
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mb-12 tracking-tighter"
          >
            Find Your Next <br className="md:hidden" />
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Dream Property
            </span>{" "}
            in India
          </motion.h2>
          <motion.div variants={itemVariants} className="w-full max-w-5xl">
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-4">
              {[
                "Residential",
                "Commercial",
                "Agriculture",
                "Industrial",
                "Resale",
                "New Launch",
                "Rental",
                "Emergency",
              ].map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-all px-6 py-3 rounded-lg"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT US SECTION */}
      <AboutUsSection />

      {/* MISSION & VISION SECTION */}
      <MissionVisionSection />

      {/* TEAM SECTION */}
      <TeamSection />

      {/* FEATURED PROPERTIES SECTION */}
      <section
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <motion.div
          className="absolute top-20 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
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

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 mb-4 bg-red-500/20 px-4 py-2 rounded-full border border-red-400/30"
            >
              <Sparkles className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">
                Premium Selection
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Featured Properties
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Hand-picked premium properties from our exclusive collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PropertyCardSkeleton />
                  </motion.div>
                ))
              : properties.map((property, i) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => handlePropertyClick(property._id)}
                    className="cursor-pointer"
                  >
                    <PropertyCard
                      property={property}
                      isWishlisted={wishlistedIds.includes(property._id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </motion.div>
                ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              onClick={() => navigate("/properties")}
              className="bg-red-600 hover:bg-red-700 px-8 text-lg group shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            >
              Explore All Properties
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* EXPLORE TOP CITIES SECTION */}
      <section
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Explore Top Cities
            </h2>
            <p className="text-lg text-white/70">
              Find properties in India's most popular destinations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-[600px]">
            {cityData.map((item, index) => (
              <motion.div
                key={item.city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "relative group overflow-hidden rounded-xl cursor-pointer shadow-lg border border-white/10 hover:border-red-400/50 transition-all duration-300",
                  item.className
                )}
              >
                <img
                  src={item.img}
                  alt={item.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold tracking-wider transform transition-transform duration-300 group-hover:-translate-y-2">
                    {item.city}
                  </h3>
                </div>
              </motion.div>
            ))}
            <motion.div
              key="Pune"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-xl cursor-pointer shadow-lg md:col-span-2 border border-white/10 hover:border-red-400/50 transition-all duration-300"
            >
              <img
                src="https://thumbs.dreamstime.com/b/shree-swaminarayan-mandir-night-pune-india-view-temple-excellent-newly-built-located-just-down-hill-lot-119574871.jpg"
                alt="Pune"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-3xl font-bold tracking-wider transform transition-transform duration-300 group-hover:-translate-y-2">
                  Pune
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPLORE BY PROPERTY TYPE SECTION */}
      <section
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Explore by Property Type
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Home,
                label: "Apartments",
                img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070",
              },
              {
                icon: Building,
                label: "Villas",
                img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070",
              },
              {
                icon: Warehouse,
                label: "Commercial",
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
              },
              {
                icon: SquareStack,
                label: "Plots & Land",
                img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532",
              },
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="group cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 hover:border-red-400/50 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundImage: `url('${type.img}')` }}
                  ></div>
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="bg-red-500/20 p-4 rounded-full mb-4 border border-red-400/30"
                    >
                      <type.icon className="w-8 h-8 text-red-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                      {type.label}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose Investors Deaal?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Your trusted partner in navigating the real estate landscape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                desc: "Every property is manually verified for authenticity, ensuring you get exactly what you see.",
              },
              {
                icon: Award,
                title: "Expert Guidance",
                desc: "Receive professional advice from our top real estate consultants at every step of your journey.",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                desc: "Access real-time market data and trend analysis to make informed, data-driven decisions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -15, scale: 1.02 }}
              >
                <Card className="text-center bg-white/5 backdrop-blur-sm border-white/10 hover:border-red-400/50 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                      whileHover={{ rotate: 360 }}
                      className="inline-block p-4 bg-red-500/20 rounded-full mb-5 border border-red-400/30"
                    >
                      <feature.icon className="w-10 h-10 text-red-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        className="py-20 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What Our Clients Say
            </h2>
          </motion.div>

          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem
                  key={t.name}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-1 h-full"
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-red-400/50 flex flex-col transition-all duration-300">
                      <CardContent className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <Quote className="w-10 h-10 text-red-400/30 mb-4" />
                          <p className="text-white/80 text-base">"{t.quote}"</p>
                        </div>
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://avatar.iran.liara.run/public?username=${t.name
                                .split("&")[0]
                                .trim()}`}
                            />
                            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{t.name}</p>
                            <p className="text-sm text-white/60">{t.city}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-10 md:p-16 text-center text-white relative overflow-hidden"
          >
            <motion.div
              className="absolute -top-10 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -bottom-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Property?
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Start your journey with us today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 text-lg"
                  onClick={() => navigate("/buy")}
                >
                  Start Searching
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-lg bg-transparent text-white border-white hover:bg-white hover:text-red-600 transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  Become an Associate
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
