import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Users,
  Building,
  Briefcase,
  ClipboardList,
  PlusCircle,
  MessageSquare,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Properties", href: "/admin/properties", icon: Building },
  { title: "Add Property", href: "/admin/properties/add", icon: PlusCircle },
  { title: "Orders", href: "/admin/orders", icon: ClipboardList },
  { title: "Leads", href: "/admin/leads", icon: MessageSquare },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Brokers", href: "/admin/brokers", icon: Briefcase },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    // CHANGE 1: Main container ko screen ki height di aur overflow ko hide kiya
    // `min-h-screen` ko `h-screen` se badla aur `overflow-hidden` add kiya
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Desktop Sidebar (Fixed) --- */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6" />
              <span>Admin Panel</span>
            </NavLink>
          </div>
          {/* Sidebar ke items agar zyada ho to yeh scroll hoga, page nahi */}
          <nav className="flex-1 overflow-auto py-4 px-2">
            <div className="grid items-start gap-1">
              {sidebarNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
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

      {/* --- Main Content and Mobile Header (Scrollable Area) --- */}
      {/* CHANGE 2: Is container ko scrollable banaya */}
      <div className="flex flex-col overflow-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 sticky top-0 z-10 bg-white md:hidden">
          {/* --- Mobile Sidebar (Sheet) --- */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
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
                  <Building className="h-6 w-6" />
                  <span>Admin Panel</span>
                </NavLink>
                {sidebarNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
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
          <span className="font-semibold">Admin Panel</span>
        </header>

        {/* CHANGE 3: Yahan se `overflow-auto` hata diya kyonki parent ab scroll ho raha hai */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
