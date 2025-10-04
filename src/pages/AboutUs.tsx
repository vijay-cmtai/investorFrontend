import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Target, Users, Handshake, Lightbulb } from "lucide-react";

const teamMembers = [
  {
    name: "Rohan Sharma",
    title: "Founder & CEO",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Priya Verma",
    title: "Head of Sales",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Amit Kumar",
    title: "Chief Technology Officer",
    image: "https://via.placeholder.com/150",
  },
];

const values = [
  {
    icon: Handshake,
    title: "Integrity",
    description:
      "We uphold the highest standards of integrity in all of our actions.",
  },
  {
    icon: Users,
    title: "Customer Commitment",
    description:
      "We develop relationships that make a positive difference in our customers' lives.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We pioneer new solutions and are passionate about making real estate simple.",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 text-center">
        <div className="container mx-auto px-4 animate-fade-in">
          <Building className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About InvestorsDeaal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in navigating the Indian real estate market
            with confidence and ease.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-right">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg mb-4">
              To empower every individual with the knowledge and tools to make
              informed real estate decisions. We aim to bring transparency,
              efficiency, and trust to property transactions through technology
              and expert guidance.
            </p>
            <p className="text-muted-foreground text-lg">
              We believe that buying or selling a property should be a seamless
              and rewarding experience, not a complex chore.
            </p>
          </div>
          <div className="animate-fade-in-left">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500"
              alt="Modern House"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-card-hover transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary/20"
                  />
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
