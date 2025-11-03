import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Heart, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout, reset as resetAuth } from "@/redux/features/auth/authSlice";
import { getWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { toast } from "sonner";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { itemIds } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [user, dispatch]);

  const navItems = [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Commercial", href: "/commercial" },
    { label: "New Projects", href: "/new-projects" },
    { label: "Property Services", href: "/property-services" },
  ];

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(resetAuth());
    navigate("/");
    toast.success("You have been signed out.");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  let profileLink = "/";
  if (user) {
    switch (user.role) {
      case "Admin":
        profileLink = "/admin/dashboard";
        break;
      case "Company":
        profileLink = "/company/dashboard";
        break;
      case "Associate":
        profileLink = "/broker/dashboard";
        break;
      case "Customer":
        profileLink = "/users/profile";
        break;
      default:
        profileLink = "/users/profile";
    }
  }

  const handlePostPropertyClick = () => {
    closeMobileMenu();
    if (!user) {
      toast.info("Please log in to post a property.");
      navigate("/auth");
      return;
    }

    let path = "";
    switch (user.role) {
      case "Admin":
        path = "/admin/add-property";
        break;
      case "Company":
        path = "/company/properties/add";
        break;
      case "Associate":
        path = "/broker/properties/add";
        break;
      default:
        toast.error(
          "Only Admins, Companies, or Associates can post properties."
        );
        return;
    }
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Investorsdeaal</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="default"
              size="sm"
              onClick={handlePostPropertyClick}
            >
              Post Property
            </Button>
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-4 w-4 mr-2" /> Wishlist
                    {itemIds && itemIds.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0"
                      >
                        {itemIds.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to={profileLink}>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Login / Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div
          className={cn(
            "md:hidden border-t",
            isMobileMenuOpen ? "block" : "hidden"
          )}
        >
          <nav className="py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t">
              {user ? (
                <>
                  <Link
                    to="/wishlist"
                    className="block"
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start relative"
                    >
                      <Heart className="h-4 w-4 mr-2" /> Saved Properties
                      {itemIds && itemIds.length > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute top-1 right-2 px-1.5 py-0.5 text-xs"
                        >
                          {itemIds.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link
                    to={profileLink}
                    className="block"
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" /> Profile
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block" onClick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth" className="block" onClick={closeMobileMenu}>
                    <Button variant="default" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={handlePostPropertyClick}
              >
                Post Property
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
