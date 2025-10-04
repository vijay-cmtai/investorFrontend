import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, FileText, ShieldCheck, UserCheck } from "lucide-react";

const legalServices = [
  {
    icon: FileText,
    title: "Document Verification",
    description:
      "Thorough verification of title deeds, sale agreements, and other property documents.",
  },
  {
    icon: ShieldCheck,
    title: "Title Search & Report",
    description:
      "Comprehensive search to ensure the property title is clear and marketable.",
  },
  {
    icon: Gavel,
    title: "Agreement Drafting",
    description:
      "Drafting and vetting of legal documents like sale agreements and rental contracts.",
  },
  {
    icon: UserCheck,
    title: "Legal Consultation",
    description:
      "Expert advice from seasoned property lawyers on any real estate matter.",
  },
];

const LegalServices = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <Gavel className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Legal Services</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Navigate the legal complexities of real estate with our expert legal
            team. Secure your investment with professional assistance.
          </p>
        </CardContent>
      </Card>

      {/* Services Offered Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Legal Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalServices.map((service, index) => (
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
          Secure Your Property Transaction
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Don't leave legal matters to chance. Schedule a consultation with one
          of our property law experts.
        </p>
        <Button size="lg">Book a Legal Consultation</Button>
      </Card>
    </div>
  );
};

export default LegalServices;
