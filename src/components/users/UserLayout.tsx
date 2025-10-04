import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Heart, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const sidebarNavItems = [
  { title: "Dashboard", href: "/users/dashboard", icon: LayoutDashboard },
  { title: "Saved Properties", href: "/users/saved-properties", icon: Heart },
  { title: "My Profile", href: "/users/profile", icon: User },
  { title: "Settings", href: "/users/settings", icon: Settings },
];

const UserLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your profile and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                  {sidebarNavItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </NavLink>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
