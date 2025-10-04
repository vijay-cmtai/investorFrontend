import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Download } from "lucide-react";

const pressReleases = [
  {
    title:
      "InvestorsDeaal Secures $20M in Series B Funding to Expand Tech Platform",
    source: "The Economic Times",
    date: "October 26, 2023",
  },
  {
    title:
      "How AI is Transforming Property Valuation in India, Featuring InvestorsDeaal",
    source: "Livemint",
    date: "September 15, 2023",
  },
  {
    title: "Top 5 Proptech Startups to Watch in 2023",
    source: "YourStory",
    date: "August 02, 2023",
  },
  {
    title:
      "InvestorsDeaal Launches Home Loan Assistance Program with 10+ Banks",
    source: "Business Standard",
    date: "July 21, 2023",
  },
];

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 text-center">
        <div className="container mx-auto px-4 animate-fade-in">
          <Newspaper className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Read the latest news, announcements, and media coverage about
            InvestorsDeaal.
          </p>
        </div>
      </section>

      {/* Press Releases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">In The News</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card
                key={index}
                className="group hover:shadow-card-hover transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    {release.date} • {release.source}
                  </p>
                  <h3 className="text-xl font-semibold mb-3">
                    {release.title}
                  </h3>
                  <a
                    href="#"
                    className="text-primary font-semibold hover:underline"
                  >
                    Read More →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-muted/30 rounded-lg p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">For Media Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              For all media-related questions or to access our media kit with
              logos and brand guidelines, please get in touch with our
              communications team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Press Team</Button>
              <Button variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
