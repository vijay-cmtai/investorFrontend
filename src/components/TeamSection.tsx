import { FC, useState, useEffect } from "react";
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
    img: "/founder2.jpg",
  },
  {
    name: "Anurag Singh",
    role: "Tech Expert",
    img: "https://cdn.pixabay.com/photo/2023/06/16/15/10/man-8068201_1280.jpg",
  },
  {
    name: "Rani Arora",
    role: "Development Team",
    img: "https://img.freepik.com/premium-photo/female-developer-background_665280-9660.jpg",
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
    <div
      className={`text-center group transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="relative w-full aspect-[4/5] mx-auto mb-4 overflow-hidden rounded-lg">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="text-amber-600 text-sm font-medium">{role}</p>
    </div>
  );
};

// Team Section Component
const TeamSection: FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 items-center">
          <TeamMemberCard {...teamMembers[0]} delay={0} />

          <div className="text-center px-6 order-first md:order-none col-span-1 md:col-start-2">
            <p className="text-sm font-semibold text-amber-600 tracking-widest uppercase mb-4">
              TEAM MEMBERS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2px] after:bg-amber-500">
              Meet Our Team
            </h2>
            <p className="text-gray-600 mt-8">
              A dynamic team of real estate experts, marketers, and mentors
              dedicated to driving growth for realtors, brokers, and developers.
            </p>
          </div>

          <TeamMemberCard {...teamMembers[1]} delay={200} />
          <TeamMemberCard {...teamMembers[2]} delay={300} />

          <div className="transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop"
              alt="Modern Villa"
              className="w-full h-full object-cover aspect-[4/5] rounded-lg"
            />
          </div>

          <TeamMemberCard {...teamMembers[3]} delay={500} />
          {/* <div className="transition-all duration-500">
            <img
              src="/foundermain.jpg"
              alt="Founder"
              className="w-full h-full object-cover aspect-[4/5] rounded-lg"
            />
          </div> */}
          {/* <TeamMemberCard {...teamMembers[4]} delay={700} /> */}
          {/* <div className="transition-all duration-500">
            <img
              src="/founder2.jpg"
              alt="Co-Founder"
              className="w-full h-full object-cover aspect-[4/5] rounded-lg"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

// Mission Vision Section Component
const MissionVisionSection: FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200 mb-4">
            <Rocket className="w-4 h-4 text-amber-600" />
            <span className="text-amber-600 text-sm font-semibold">
              OUR FOUNDATION
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Mission & Vision
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Building India's most innovative real estate ecosystem with
            transparency, technology, and trust at its core
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Mission Card */}
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                alt="Mission"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 p-3 bg-amber-600 rounded-xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                Our Mission
              </h3>

              <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                To{" "}
                <span className="text-amber-600 font-semibold">
                  revolutionize
                </span>{" "}
                the Indian real estate market through cutting-edge technology,
                unwavering transparency, and absolute trust—making property
                investment accessible, profitable, and seamless for everyone.
              </p>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Democratizing real estate investment with tech-driven
                    solutions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Ensuring 100% transparency in every transaction
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Empowering investors with data-driven insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Vision"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 p-3 bg-amber-700 rounded-xl shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                Our Vision
              </h3>

              <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                To become{" "}
                <span className="text-amber-700 font-semibold">
                  India's #1 trusted
                </span>{" "}
                and most comprehensive real estate ecosystem, creating lasting
                value, building generational wealth, and establishing legacies
                for our clients, partners, and communities.
              </p>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Building a comprehensive property ecosystem across India
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Setting industry standards for excellence and integrity
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    Creating lasting impact for investors and communities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { value: "10K+", label: "Happy Clients", icon: Users },
            { value: "500+", label: "Properties Listed", icon: Building2 },
            { value: "₹1000Cr+", label: "Worth Transacted", icon: TrendingUp },
            { value: "50+", label: "Cities Covered", icon: Award },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-center hover:border-amber-300"
            >
              <stat.icon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
const App: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <TeamSection />
    </div>
  );
};

export default App;
