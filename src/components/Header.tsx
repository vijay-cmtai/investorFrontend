import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout, reset as resetAuth } from "@/redux/features/auth/authSlice";
import { getWishlist } from "@/redux/features/wishlist/wishlistSlice";

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
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  let profileLink = "/";
  if (user) {
    switch (user.role) {
      case "admin":
        profileLink = "/admin/dashboard";
        break;
      case "broker":
        profileLink = "/broker/dashboard";
        break;
      default:
        profileLink = "/users/profile";
    }
  }

  const handlePostPropertyClick = () => {
    closeMobileMenu();
    if (!user) {
      navigate("/auth");
      return;
    }
    const path =
      user.role === "admin"
        ? "/admin/properties/add"
        : "/broker/properties/add";
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo1.png"
              alt="Investorsdeal Logo"
              className="h-28 w-auto ml-5"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-4 w-4 mr-2" /> Wishlist
                    {itemIds && itemIds.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
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
                <Button variant="destructive" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={handlePostPropertyClick}
            >
              Post Property
            </Button>
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
                    className="w-full justify-start"
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
