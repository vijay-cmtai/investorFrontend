import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Mail
} from 'lucide-react';

const PropertyServices = () => {
  const services = [
    {
      icon: Calculator,
      title: 'Home Loan Assistance',
      description: 'Get the best home loan deals with competitive interest rates from top banks and financial institutions.',
      features: ['Instant Approval', 'Competitive Rates', 'Minimal Documentation', 'Expert Guidance'],
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: FileText,
      title: 'Legal Documentation',
      description: 'Complete legal documentation and verification services for property transactions.',
      features: ['Title Verification', 'Agreement Drafting', 'Registration Support', 'Legal Compliance'],
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: Shield,
      title: 'Property Insurance',
      description: 'Comprehensive property insurance coverage to protect your investment.',
      features: ['Home Insurance', 'Fire Coverage', 'Natural Disaster Protection', 'Theft Protection'],
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: Gavel,
      title: 'Legal Advisory',
      description: 'Expert legal advice and consultation for all property-related matters.',
      features: ['Property Disputes', 'Contract Review', 'Compliance Check', 'Court Representation'],
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: CreditCard,
      title: 'Payment Solutions',
      description: 'Flexible payment solutions and financial planning for property purchases.',
      features: ['EMI Planning', 'Down Payment Assistance', 'Tax Planning', 'Investment Advisory'],
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      icon: Home,
      title: 'Property Management',
      description: 'Complete property management services for owners and tenants.',
      features: ['Tenant Management', 'Maintenance Services', 'Rent Collection', 'Property Marketing'],
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Property Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive property services to make your real estate journey smooth and hassle-free
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-card-hover transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                    <service.icon className={`w-8 h-8 ${service.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide end-to-end property services with expertise and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-muted-foreground">
                Our team of experienced professionals ensures quality service delivery
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted & Secure</h3>
              <p className="text-muted-foreground">
                All our services are backed by legal compliance and security measures
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Support</h3>
              <p className="text-muted-foreground">
                From documentation to registration, we handle everything for you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Need Help with Property Services?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our experts are ready to assist you with all your property service needs. Contact us today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91 98765 43210
              </Button>
              <Button variant="outline" size="lg" className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyServices;