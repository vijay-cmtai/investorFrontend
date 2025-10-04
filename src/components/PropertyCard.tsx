import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: { city: string; area: string };
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  transaction_type: "sale" | "rent" | "lease";
  property_type: string;
  images: string[];
}

interface PropertyCardProps {
  property: Property;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isWishlisted,
  onToggleWishlist,
  className,
}) => {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  if (!property) return null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(property._id);
  };

  const formatPrice = (price: number, status: string) => {
    const priceStr = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
    return status === "rent" ? `${priceStr}/month` : priceStr;
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <div className="relative">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-48"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {property.images?.length > 0 ? (
              property.images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    src={img}
                    alt={`${property.title} ${index + 1}`}
                    className="h-48 w-full object-cover"
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <img
                  src="https://via.placeholder.com/400x250"
                  alt="Placeholder"
                  className="h-48 w-full object-cover"
                />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>

        <Badge
          className={cn(
            "absolute top-3 left-3 z-10",
            property.transaction_type === "sale"
              ? "bg-green-500"
              : "bg-blue-500",
            "text-white"
          )}
        >
          For {property.transaction_type}
        </Badge>

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white rounded-full h-8 w-8"
          onClick={handleWishlistClick}
        >
          <Heart
            className={cn(
              "w-4 h-4 text-gray-700",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price, property.transaction_type)}
            </p>
            <p className="text-sm text-muted-foreground">
              {property.property_type}
            </p>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-1 text-lg">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.location?.area}, {property.location?.city}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.square_feet?.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
