import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// === YAHAN PAR 'Users' AUR 'CheckCircle' ADD KIYA GAYA HAI ===
import {
  ArrowRight,
  Target,
  Zap,
  Handshake,
  Award,
  Gem,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-24 text-center bg-gray-50">
        <div className="container mx-auto px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Building the Future of{" "}
            <span className="text-red-600">Real Estate</span> in India
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We are not just a property portal; we are a growth platform for our
            partners and a trusted guide for our customers, driven by technology
            and a commitment to transparency.
          </p>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-right">
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg">
                To become India's most trusted and technologically advanced real
                estate ecosystem, creating unparalleled value for every
                stakeholder. We aim to be the undisputed No. 1 platform by
                empowering our partners and simplifying property decisions for
                our customers.
              </p>
            </div>
            <div className="animate-fade-in-left">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start">
                  <Handshake className="w-6 h-6 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <span>
                    <strong>Empower Partners:</strong> To provide our network of
                    contractors and associates with tools and a high-yield
                    commission structure, enabling them to maximize their
                    earnings.
                  </span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-6 h-6 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <span>
                    <strong>Innovate with Technology:</strong> To leverage
                    technology for a seamless, transparent, and efficient
                    property buying, selling, and renting experience.
                  </span>
                </li>
                <li className="flex items-start">
                  <Award className="w-6 h-6 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <span>
                    <strong>Deliver Excellence:</strong> To offer a curated
                    portfolio of verified properties and expert advisory
                    services, ensuring customer confidence.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
            <p className="text-lg text-gray-600 mt-2">
              The principles that guide our every decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We operate with unwavering honesty and transparency in every
                transaction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly push the boundaries of technology to simplify the
                real estate process.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer-Centricity</h3>
              <p className="text-gray-600">
                Our customers and partners are at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact in Numbers Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Our Impact in Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold">50,000+</h3>
              <p className="text-lg mt-2 opacity-90">Properties Listed</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold">10,000+</h3>
              <p className="text-lg mt-2 opacity-90">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold">5,000+</h3>
              <p className="text-lg mt-2 opacity-90">Empowered Partners</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold">100+</h3>
              <p className="text-lg mt-2 opacity-90">Cities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Leadership Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Meet the Visionaries
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              The minds behind our mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="text-center overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <img
                  src="/founder.jpg"
                  alt="Manish Tiwari"
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                />
                <h3 className="text-2xl font-bold">Manish Tiwari</h3>
                <p className="text-red-600 font-semibold mb-2">Founder & CEO</p>
                <p className="text-gray-600">
                  With a vision to democratize real estate, Manish leads our
                  mission to build India's most innovative property platform.
                  His focus is on leveraging technology to create wealth for our
                  partners and value for our customers.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <img
                  src="/cofounder.jpg"
                  alt="Rashmi Rana"
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                />
                <h3 className="text-2xl font-bold">Rashmi Rana</h3>
                <p className="text-red-600 font-semibold mb-2">
                  Co-Founder & Chief Sales Officer
                </p>
                <p className="text-gray-600">
                  Rashmi is the driving force behind our expansive partner
                  network. Her expertise lies in building strong relationships
                  and creating a framework where every contractor and associate
                  can achieve their highest earning potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us? Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Investors Deaal?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gray-50">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold">
                  For Homebuyers & Investors
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Verified Listings:</strong> Every property is checked
                  for authenticity.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Expert Guidance:</strong> Free advisory from our real
                  estate experts.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Transparent Process:</strong> No hidden costs or
                  surprises.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>End-to-End Service:</strong> From site visits to legal
                  paperwork, we help you everywhere.
                </li>
              </ul>
            </Card>
            <Card className="p-8 bg-gray-50">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold">
                  For Contractors & Partners
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Maximize Your Earnings:</strong> Industry-leading
                  commission structure.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Technology at Your Fingertips:</strong> A powerful
                  dashboard to manage leads and track earnings.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Access to Exclusive Inventory:</strong> Get access to
                  premium properties before anyone else.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                  <strong>Grow Your Network:</strong> Become part of a
                  nationwide network of real estate professionals.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Shaping the Future
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're looking for your dream property or seeking to grow
            your business as a partner, we have the right platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/buy">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
              >
                Find a Property <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
