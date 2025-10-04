import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Flame, Home, Zap } from "lucide-react";

const coverage = [
  {
    icon: Flame,
    title: "Fire & Allied Perils",
    description:
      "Protection against damages from fire, lightning, and explosions.",
  },
  {
    icon: Zap,
    title: "Natural Calamities",
    description:
      "Coverage for losses due to floods, earthquakes, storms, and cyclones.",
  },
  {
    icon: Home,
    title: "Burglary & Theft",
    description:
      "Financial protection against theft and burglary at your insured property.",
  },
  {
    icon: Shield,
    title: "Comprehensive Cover",
    description:
      "An all-in-one plan that covers structural damage, contents, and more.",
  },
];

const PropertyInsurance = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Property Insurance</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Protect your most valuable asset. Get comprehensive property
            insurance to safeguard your home against unforeseen events.
          </p>
        </CardContent>
      </Card>

      {/* Coverage Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Coverage Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coverage.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-card-hover transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <item.icon className="w-6 h-6 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">
          Get Your Property Insured Today
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Receive a custom insurance quote in minutes and secure your home
          instantly.
        </p>
        <Button size="lg">Get an Instant Quote</Button>
      </Card>
    </div>
  );
};

export default PropertyInsurance;
