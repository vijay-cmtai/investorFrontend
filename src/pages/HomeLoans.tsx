import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, CheckCircle, Calculator } from "lucide-react";

const features = [
  {
    title: "Lowest Interest Rates",
    description:
      "We partner with leading banks to offer you competitive rates.",
  },
  {
    title: "Quick Approval",
    description:
      "Our streamlined process ensures your loan is approved in record time.",
  },
  {
    title: "Minimal Paperwork",
    description: "Hassle-free documentation process with our digital platform.",
  },
  {
    title: "Expert Guidance",
    description: "Our loan experts guide you at every step of the way.",
  },
];

const HomeLoans = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <Landmark className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Home Loans</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Turn your dream of owning a home into reality with our tailored home
            loan solutions. Easy, fast, and transparent.
          </p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">
          Why Choose Our Home Loan Services?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-card-hover transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="text-center p-8">
        <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Check Your Eligibility</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Find out how much you can borrow and get a pre-approved loan offer in
          minutes.
        </p>
        <Button size="lg">Calculate EMI & Apply Now</Button>
      </Card>
    </div>
  );
};

export default HomeLoans;
