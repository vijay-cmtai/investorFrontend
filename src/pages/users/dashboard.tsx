import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";

const UserDashboard = () => {
  const recentActivity = {
    id: "prop-101",
    title: "Modern 3BHK in Gurgaon",
    price: 12000000, 
    location: "Sector 48",
    area: "Gurgaon",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1800,
    status: "sale" as const,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
    isFeatured: true,
    isVerified: true,
    agent: {
      name: "Rajesh Kumar",
      phone: "9876543210",
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recently Viewed Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyCard property={recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
