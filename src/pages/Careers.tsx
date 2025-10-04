import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// यहाँ पर Users को import किया गया है
import { Briefcase, Zap, Rocket, Users, ArrowRight } from "lucide-react";

const jobOpenings = [
  {
    title: "Senior React Developer",
    location: "Remote",
    department: "Technology",
    type: "Full-time",
  },
  {
    title: "Real Estate Sales Executive",
    location: "Delhi",
    department: "Sales",
    type: "Full-time",
  },
  {
    title: "Digital Marketing Manager",
    location: "Bangalore",
    department: "Marketing",
    type: "Full-time",
  },
  {
    title: "Product Manager - Real Estate Tech",
    location: "Remote",
    department: "Product",
    type: "Full-time",
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 text-center">
        <div className="container mx-auto px-4 animate-fade-in">
          <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Be a part of a passionate team that's revolutionizing the real
            estate industry.
          </p>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">
            Why You'll Love Working Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4">
              <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drive Innovation</h3>
              <p className="text-muted-foreground">
                Work with cutting-edge technology to build the future of real
                estate.
              </p>
            </div>
            <div className="p-4">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast-Paced Growth</h3>
              <p className="text-muted-foreground">
                Accelerate your career in a dynamic, high-growth environment.
              </p>
            </div>
            {/* यह वाला सेक्शन अब सही चलेगा */}
            <div className="p-4">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Great Culture</h3>
              <p className="text-muted-foreground">
                Join a supportive and collaborative team that values every
                member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Current Openings
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job, index) => (
              <Card
                key={index}
                className="group hover:shadow-card-hover transition-shadow duration-300"
              >
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span>{job.department}</span> •{" "}
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Button>
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
