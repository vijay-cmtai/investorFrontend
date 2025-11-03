// src/components/company/CompanyLayout.tsx

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiHome,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiUser,
  FiMenu,
  FiSettings,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  { title: "Dashboard", href: "/company/dashboard", icon: FiGrid },
  { title: "Properties", href: "/company/properties", icon: FiHome },
  { title: "Leads", href: "/company/leads", icon: FiUsers },
  { title: "Reports", href: "/company/reports", icon: FiBarChart2 },
  { title: "Profile", href: "/company/profile", icon: FiUser },
];
const CompanyLayout = () => {
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
      <aside className="hidden border-r bg-gray-800 text-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
            <NavLink
              to="/company/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-xl">Company Panel</span>
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
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-white hover:bg-gray-700",
                      isActive && "bg-red-600 text-white font-semibold"
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
        {/* Header (Desktop aur Mobile ke liye) */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-20 lg:h-[60px] lg:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <FiMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink
                  to="/company/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <span>Company Panel</span>
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

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/boy?username=${user?.email || "user"}`}
                  />
                  <AvatarFallback>
                    {user?.name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/company/profile")}>
                <FiUser className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FiSettings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <FiLogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
