import React, { useEffect, useRef, FC } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertySearch from "@/components/PropertySearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  MapPin,
  Users,
  Shield,
  Award,
  Quote,
  Building,
  Home,
  Warehouse,
  SquareStack,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  Property,
} from "@/redux/features/properties/propertySlice";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";

const mockProperties: Partial<Property>[] = [
  { _id: "mock1" },
  { _id: "mock2" },
  { _id: "mock3" },
];

const Index: FC = () => {
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
    dispatch(getProperties());
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

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
        className="relative text-white py-20 min-h-[70vh] md:min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Find Your Dream Property in India
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover perfect homes, offices, and investment opportunities with
              Photon.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-sm"
              >
                <TrendingUp className="w-4 h-4 mr-2" /> 50,000+ Properties
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4 mr-2" /> 100+ Cities
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-sm"
              >
                <Users className="w-4 h-4 mr-2" /> 1M+ Happy Customers
              </Badge>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <PropertySearch />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hand-picked premium properties from our exclusive collection.
            </p>
          </div>
          {isLoading && properties.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map((prop) => (
                <Card key={prop._id} className="animate-pulse overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-4">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: properties.length > 3 }}
              plugins={[plugin.current]}
              className="w-full max-w-7xl mx-auto"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-4">
                {properties.map((property) => (
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
            <Button
              size="lg"
              onClick={() => navigate("/buy")}
              className="px-8 text-lg"
            >
              Explore All Properties
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Top Cities
            </h2>
            <p className="text-lg text-muted-foreground">
              Find properties in India's most popular cities.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                city: "Mumbai",
                img: "https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg",
              },
              {
                city: "Delhi",
                img: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
              },
              {
                city: "Bangalore",
                img: "https://s7ap1.scene7.com/is/image/incredibleindia/vidhana-soudha-bangalore-karnataka-hero?qlt=82&ts=1742199603184",
              },
              {
                city: "Pune",
                img: "https://thumbs.dreamstime.com/b/shree-swaminarayan-mandir-night-pune-india-view-temple-excellent-newly-built-located-just-down-hill-lot-119574871.jpg",
              },
            ].map((item) => (
              <div
                key={item.city}
                className="relative group overflow-hidden rounded-lg cursor-pointer h-64 shadow-lg"
              >
                <img
                  src={item.img}
                  alt={item.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white text-2xl font-bold tracking-wider">
                    {item.city}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore by Property Type
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Home, label: "Apartments" },
              { icon: Building, label: "Villas" },
              { icon: Warehouse, label: "Commercial" },
              { icon: SquareStack, label: "Plots & Land" },
            ].map((type) => (
              <Card
                key={type.label}
                className="group cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <CardContent className="p-6 text-center">
                  <type.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                    {type.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-none">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Verified Properties
                </h3>
                <p className="text-muted-foreground">
                  All properties are manually verified for authenticity,
                  ensuring you get what you see.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Get professional advice from our top real estate consultants
                  at every step of your journey.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
                <p className="text-muted-foreground">
                  Access real-time market data, trend analysis, and price
                  insights to make informed decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
          </div>
          <Carousel opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                {
                  name: "Rohan & Priya",
                  city: "Mumbai",
                  quote:
                    "The team made our dream of owning a home in Mumbai a reality. The process was so smooth and transparent!",
                },
                {
                  name: "Amit Singh",
                  city: "Delhi",
                  quote:
                    "Found the perfect office space for my startup through this platform. The expert guidance was invaluable.",
                },
              ].map((t) => (
                <CarouselItem key={t.name}>
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6 text-center">
                      <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="text-lg md:text-xl text-muted-foreground mb-6 italic">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.iran.liara.run/public?username=${t.name.split("&")[0].trim()}`}
                          />
                          <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.city}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-12 text-center text-white relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Growing Network
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're looking to buy a property or build a career in real
              estate, Photon Platform is your destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 text-lg"
                onClick={() => navigate("/buy")}
              >
                Find a Property
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-lg bg-transparent text-white border-white hover:bg-white hover:text-primary"
                onClick={() => navigate("/auth")}
              >
                Become an Associate
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
