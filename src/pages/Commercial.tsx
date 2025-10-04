import React, { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building2, TrendingUp } from "lucide-react";
import {
  mockProperties,
  getFilteredProperties,
  type Property,
} from "@/data/mockProperties";
import { useNavigate } from "react-router-dom";

const Commercial = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const commercialProperties = mockProperties.filter(
      (property) =>
        property.type.toLowerCase().includes("office") ||
        property.type.toLowerCase().includes("commercial") ||
        property.status === "lease"
    );
    setFilteredProperties(commercialProperties);
  }, []);

  const handleFiltersChange = (filters: any) => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = getFilteredProperties(filters).filter(
        (property) =>
          property.type.toLowerCase().includes("office") ||
          property.type.toLowerCase().includes("commercial") ||
          property.status === "lease"
      );
      setFilteredProperties(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleFavorite = (propertyId: string) => {
    console.log("Favorited property:", propertyId);
  };

  const handleShare = (propertyId: string) => {
    console.log("Shared property:", propertyId);
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const heroBackgroundImage =
    "https://www.resmanagement.in/img/blog/commercial-properties-in-ahemedabad-res-management.webp";

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative bg-cover bg-center py-20 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackgroundImage})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <Building2 className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Commercial Properties
            </h1>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
              Explore prime commercial spaces and office properties for your
              business needs
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <TrendingUp className="w-6 h-6 text-white mr-3" />
                <div className="text-left">
                  <p className="font-semibold">{filteredProperties.length}+</p>
                  <p className="text-sm text-neutral-300">Commercial Spaces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4">
          <PropertyFilters onFiltersChange={handleFiltersChange} />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">
                {filteredProperties.length} Commercial Properties Found
              </h2>
              <p className="text-muted-foreground mt-2">
                Find the perfect commercial space for your business
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="animate-fade-in hover-scale cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <PropertyCard
                    property={property}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Commercial Properties Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button variant="outline">Clear All Filters</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Commercial;
