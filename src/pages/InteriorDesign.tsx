import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Sofa, Lamp, Ruler } from "lucide-react";

const designServices = [
  {
    icon: Ruler,
    title: "Space Planning",
    description: "Optimal layout design to maximize functionality and flow.",
  },
  {
    icon: Sofa,
    title: "Furniture Selection",
    description:
      "Curation of furniture and decor that matches your style and budget.",
  },
  {
    icon: Lamp,
    title: "Lighting Design",
    description:
      "Creating the perfect ambiance with a strategic lighting plan.",
  },
  {
    icon: Paintbrush,
    title: "Color Consultation",
    description: "Expert advice on color palettes to bring your space to life.",
  },
];

const InteriorDesign = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <Paintbrush className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Interior Design</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Transform your house into a home. Our designers create personalized,
            beautiful, and functional living spaces.
          </p>
        </CardContent>
      </Card>

      {/* Our Services Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {designServices.map((service, index) => (
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
          Ready to Design Your Dream Home?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Talk to our design experts and get a free proposal for your space.
        </p>
        <Button size="lg">Get a Free Design Quote</Button>
      </Card>
    </div>
  );
};

export default InteriorDesign;
