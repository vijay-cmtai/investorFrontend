import React, { useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  User,
  Settings,
  Menu,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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

// Apne sabhi user pages ko yahan import karein
import UserDashboard from "@/pages/users/dashboard";
import SavedProperties from "@/pages/users/SavedProperties";
import UserProfile from "@/pages/users/Profile";
// === BADLAV 1: Settings page ko import karein ===
import UserSettings from "@/pages/users/UserSettings";

// === BADLAV 2: Sidebar ke link ko theek karein ===
const sidebarNavItems = [
  { title: "Dashboard", href: "/users/dashboard", icon: LayoutDashboard },
  { title: "Saved Properties", href: "/users/saved-properties", icon: Heart },
  { title: "MyOrder", href: "/users/my-orders", icon: Building2 }, // Future use ke liye
  { title: "My Profile", href: "/users/profile", icon: User },
  { title: "Settings", href: "/users/settings", icon: Settings }, // 'UserSettings' ko 'settings' aur 'title' ko 'Settings' kiya
];

const UserLayout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/auth");
  };

  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <Building2 className="h-6 w-6 text-primary" />
              <span>User Panel</span>
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
                      isActive &&
                        "bg-primary text-primary-foreground font-semibold hover:text-primary-foreground"
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
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-20 lg:h-[60px] lg:px-6">
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
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Building2 className="h-6 w-6 text-primary" />
                  <span>User Panel</span>
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
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/users/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/users/settings")}>
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
        {/* --- Page Content --- */}
        <main className="flex-1 p-4 lg:p-6 bg-muted/40">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="saved-properties" element={<SavedProperties />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
            {/* <Route path="my-orders" element={<MyOrdersPage />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
