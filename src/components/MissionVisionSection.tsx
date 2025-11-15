import { FC } from "react";
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
    <section className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 mb-4">
            <Rocket className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-sm font-semibold">
              OUR FOUNDATION
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Mission & Vision
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Building India's most innovative real estate ecosystem with
            transparency, technology, and trust at its core
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Mission Card */}
          <div className="group bg-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                alt="Mission"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 p-3 bg-red-600 rounded-xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Our Mission
              </h3>

              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                To{" "}
                <span className="text-red-600 font-semibold">
                  revolutionize
                </span>{" "}
                the Indian real estate market through cutting-edge technology,
                unwavering transparency, and absolute trust—making property
                investment accessible, profitable, and seamless for everyone.
              </p>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Democratizing real estate investment with tech-driven
                    solutions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Ensuring 100% transparency in every transaction
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Empowering investors with data-driven insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group bg-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Vision"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 p-3 bg-orange-600 rounded-xl shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Our Vision
              </h3>

              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                To become{" "}
                <span className="text-orange-600 font-semibold">
                  India's #1 trusted
                </span>{" "}
                and most comprehensive real estate ecosystem, creating lasting
                value, building generational wealth, and establishing legacies
                for our clients, partners, and communities.
              </p>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Building a comprehensive property ecosystem across India
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Setting industry standards for excellence and integrity
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
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
              className="bg-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <stat.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
