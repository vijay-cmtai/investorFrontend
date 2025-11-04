import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  FileText,
  Shield,
  Gavel,
  CreditCard,
  Home,
  Users,
  CheckCircle,
  Phone,
  Mail,
  Zap,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this utility

const PropertyServices = () => {
  const services = [
    {
      icon: Calculator,
      title: "Home Loan Assistance",
      description:
        "Unlock your dream home with our seamless loan assistance. We partner with top banks to bring you competitive interest rates and minimal documentation, ensuring a quick and easy approval process.",
      features: [
        "Instant Digital Approval",
        "Lowest Interest Rates Guaranteed",
        "Zero Processing Fees Offer",
        "Personalized Expert Guidance",
      ],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FileText,
      title: "Legal Documentation",
      description:
        "Navigate property transactions with confidence. Our legal experts handle everything from title verification and agreement drafting to registration support, ensuring full legal compliance.",
      features: [
        "Ironclad Title Verification",
        "Custom Agreement Drafting",
        "Hassle-free Registration",
        "Complete Legal Compliance",
      ],
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Shield,
      title: "Property Insurance",
      description:
        "Safeguard your valuable asset against unforeseen events. We offer comprehensive insurance plans covering everything from natural disasters to theft, giving you complete peace of mind.",
      features: [
        "All-risk Home Insurance",
        "Fire & Theft Coverage",
        "Natural Disaster Protection",
        "Quick Claim Processing",
      ],
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Gavel,
      title: "Legal Advisory",
      description:
        "Get expert legal counsel for any property-related matter. From dispute resolution to contract reviews, our seasoned lawyers provide strategic advice to protect your interests.",
      features: [
        "Property Dispute Resolution",
        "In-depth Contract Review",
        "Regulatory Compliance Check",
        "Expert Court Representation",
      ],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: CreditCard,
      title: "Payment Solutions",
      description:
        "Streamline your property purchase with our smart financial solutions. We assist with EMI planning, down payment options, and tax-saving strategies to make your investment smarter.",
      features: [
        "Flexible EMI Planning",
        "Down Payment Assistance",
        "Strategic Tax Planning",
        "Investment Advisory",
      ],
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Home,
      title: "Property Management",
      description:
        "Maximize your rental income without the hassle. Our end-to-end property management services cover tenant screening, maintenance, rent collection, and marketing your property.",
      features: [
        "Rigorous Tenant Screening",
        "Proactive Maintenance",
        "Automated Rent Collection",
        "Professional Property Marketing",
      ],
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  const [activeService, setActiveService] = useState(services[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* === HERO SECTION === */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Your One-Stop Solution for Property Services
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                From securing loans to managing paperwork, we offer a complete
                suite of services to make your real estate journey smooth,
                transparent, and hassle-free.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">
                    Experienced Professional Team
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">
                    Transparent and Secure Processes
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">
                    Complete End-to-End Support
                  </p>
                </div>
              </div>
            </div>
            <div
              className="hidden lg:block relative h-96 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-2xl"></div>
              <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 w-96 shadow-2xl bg-background/80 backdrop-blur-md">
                <CardHeader className="p-0 mb-4">
                  <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">
                    Seamless Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    We handle the complexity, so you can focus on your new
                    beginning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* === INTERACTIVE SERVICES SECTION === */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a service to see how we can help you at every step of your
              property journey.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Service List */}
            <div className="lg:col-span-1 space-y-2">
              {services.map((service) => (
                <button
                  key={service.title}
                  onClick={() => setActiveService(service)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center gap-4",
                    activeService.title === service.title
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-md",
                      activeService.title === service.title
                        ? "bg-primary-foreground/20"
                        : service.bgColor
                    )}
                  >
                    <service.icon
                      className={cn(
                        "w-6 h-6",
                        activeService.title === service.title
                          ? "text-primary-foreground"
                          : service.color
                      )}
                    />
                  </div>
                  <span className="font-semibold">{service.title}</span>
                </button>
              ))}
            </div>
            {/* Right: Active Service Details */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-xl sticky top-24 min-h-[450px]">
                <div key={activeService.title} className="animate-fade-in">
                  <div
                    className={`w-20 h-20 rounded-2xl ${activeService.bgColor} flex items-center justify-center mb-6`}
                  >
                    <activeService.icon
                      className={`w-10 h-10 ${activeService.color}`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {activeService.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {activeService.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {activeService.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="lg" className="w-full sm:w-auto">
                    Enquire Now <Mail className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* === CONTACT CTA SECTION === */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-background shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Simplify Your Property Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Our experts are just a call away. Get a free consultation
                  today and take the first step towards a stress-free property
                  experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1">
                    <Phone className="w-5 h-5 mr-2" /> Call Our Experts
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Mail className="w-5 h-5 mr-2" /> Email Your Query
                  </Button>
                </div>
              </div>
              <div
                className="hidden md:block bg-cover bg-center rounded-r-lg"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1556740738-b6a63e2775df?q=80&w=2070&auto=format&fit=crop')`,
                }}
              ></div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PropertyServices;
