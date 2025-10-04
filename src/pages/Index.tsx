import React, { useEffect, useRef } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertySearch from "@/components/PropertySearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MapPin, Users, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProperties } from "@/redux/features/properties/propertySlice";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import heroBackground from "@/assets/hero-background.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { properties, isLoading } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  useEffect(() => {
    dispatch(getProperties({ isFeatured: true }));
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const featuredProperties = properties.slice(0, 9);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to save properties to your wishlist.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative text-white py-20 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Property in India
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover perfect homes, offices, and investment opportunities
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 backdrop-blur">
                <TrendingUp className="w-4 h-4 mr-2" />
                50,000+ Properties
              </Badge>
              <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 backdrop-blur">
                <MapPin className="w-4 h-4 mr-2" />
                100+ Cities
              </Badge>
              <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 backdrop-blur">
                <Users className="w-4 h-4 mr-2" />
                1M+ Happy Customers
              </Badge>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <PropertySearch />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hand-picked premium properties from our exclusive collection
            </p>
          </div>
          {isLoading && featuredProperties.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[plugin.current]}
              className="w-full max-w-7xl mx-auto"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-4">
                {featuredProperties.map((property) => (
                  <CarouselItem
                    key={property._id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className="p-1 cursor-pointer"
                      onClick={() => handlePropertyClick(property._id)}
                    >
                      <PropertyCard
                        property={property}
                        isWishlisted={wishlistedIds.includes(property._id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
          <div className="text-center mt-12 animate-fade-in">
            <Button size="lg" onClick={() => navigate("/buy")} className="px-8">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-scale animate-fade-in">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Verified Properties
                </h3>
                <p className="text-muted-foreground">
                  All properties are verified for authenticity.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover-scale animate-fade-in">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Get professional advice from our consultants.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover-scale animate-fade-in">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
                <p className="text-muted-foreground">
                  Access real-time market data to make decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
