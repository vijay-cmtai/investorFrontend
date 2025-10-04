import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart2, Briefcase, Download } from "lucide-react";

const reports = [
  {
    title: "Q3 2023 Financial Report",
    icon: FileText,
    file: "/reports/q3-2023.pdf",
  },
  {
    title: "2022 Annual Report",
    icon: FileText,
    file: "/reports/annual-2022.pdf",
  },
  {
    title: "Investor Presentation - Nov 2023",
    icon: BarChart2,
    file: "/reports/investor-deck-nov-2023.pdf",
  },
  {
    title: "Corporate Governance Policies",
    icon: Briefcase,
    file: "/reports/governance.pdf",
  },
];

const InvestorRelations = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 text-center">
        <div className="container mx-auto px-4 animate-fade-in">
          <BarChart2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Investor Relations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to providing transparent and timely information to our
            shareholders and the financial community.
          </p>
        </div>
      </section>

      {/* Financial Reports Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Reports & Filings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reports.map((report, index) => (
              <Card
                key={index}
                className="group hover:shadow-card-hover transition-shadow duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <report.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">{report.title}</h3>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Governance Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Corporate Governance</h2>
          <p className="text-muted-foreground text-lg mb-4">
            InvestorsDeaal is committed to the highest standards of corporate
            governance. Our Board of Directors and management team are dedicated
            to acting in the best interests of our shareholders, employees, and
            the communities we serve.
          </p>
          <p className="text-muted-foreground text-lg">
            Our governance framework ensures accountability, fairness, and
            transparency in our relationship with all stakeholders.
          </p>
        </div>
      </section>

      {/* Investor Contact */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Investor Contact</h2>
          <p className="text-lg text-muted-foreground mb-2">
            For inquiries from institutional investors and analysts:
          </p>
          <a
            href="mailto:investors@investorsdeaal.com"
            className="text-xl font-semibold text-primary hover:underline"
          >
            investors@investorsdeaal.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default InvestorRelations;
