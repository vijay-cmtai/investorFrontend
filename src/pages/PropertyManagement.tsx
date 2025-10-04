import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Wrench, Users, ClipboardList } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Tenant Management",
    description: "Screening, onboarding, and communication with tenants.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repairs",
    description:
      "Regular upkeep and emergency repair services to keep your property in top shape.",
  },
  {
    icon: ClipboardList,
    title: "Rent Collection",
    description:
      "Timely and automated rent collection and financial reporting.",
  },
  {
    icon: Home,
    title: "Property Marketing",
    description:
      "Listing your property on top portals to find the right tenants quickly.",
  },
];

const PropertyManagement = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <Home className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Property Management</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We take care of your property like it's our own. Maximize your
            rental income and enjoy peace of mind with our professional
            services.
          </p>
        </CardContent>
      </Card>

      {/* Services Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">What We Manage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:shadow-card-hover transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <service.icon className="w-6 h-6 text-primary" />
                  <CardTitle>{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">
          Effortless Property Ownership
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Let us handle the day-to-day management of your property. Get a free
          consultation today.
        </p>
        <Button size="lg">Request a Callback</Button>
      </Card>
    </div>
  );
};

export default PropertyManagement;
