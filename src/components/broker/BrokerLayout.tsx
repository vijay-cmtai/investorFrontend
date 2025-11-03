import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Mail,
  User,
  PlusCircle,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarNavItems = [
  { title: "Dashboard", href: "/broker/dashboard", icon: LayoutDashboard },
  { title: "My Properties", href: "/broker/properties", icon: Building },
  { title: "Add Property", href: "/broker/properties/add", icon: PlusCircle },
  { title: "Enquiries", href: "/broker/enquiries", icon: Mail },
];

const BrokerLayout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/auth");
  };

  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar for Desktop --- */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink
              to="/broker/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Building className="h-6 w-6 text-primary" />
              <span>Broker Panel</span>
            </NavLink>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2">
            <div className="grid items-start gap-1">
              {sidebarNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary font-semibold"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex flex-col overflow-auto">
        {/* --- Header for Mobile and Desktop --- */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-20 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink
                  to="/broker/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Building className="h-6 w-6 text-primary" />
                  <span>Broker Panel</span>
                </NavLink>
                {sidebarNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                        isActive && "bg-muted text-foreground"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://avatar.iran.liara.run/public/boy" />
                  <AvatarFallback>BR</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/broker/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/broker/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BrokerLayout;
