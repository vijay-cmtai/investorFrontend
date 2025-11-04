import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  Routes, // Yeh import karein
  Route, // Yeh import karein
  Navigate, // Yeh import karein
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShoppingCart,
  Target,
  PlusCircle,
  Settings,
  Menu,
  Network,
  DollarSign,
  FileBarChart,
  ShieldCheck,
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

// Apne sabhi admin pages ko yahan import karein
import AdminDashboard from "@/pages/admin/dashboard";
import AddPropertyAdmin from "@/pages/admin/AddpropertyByAdmin";
import ManageProperties from "@/pages/admin/ManageProperties";
import ManageOrders from "@/pages/admin/ManageOrders";
import ManageLeads from "@/pages/admin/ManageLeads";
import ManageUsers from "@/pages/admin/ManageUsers";
import SettingsPage from "@/pages/admin/Settings";
import MLMSystem from "@/pages/admin/MLMSystem";
import CommissionManagement from "@/pages/admin/CommissionManagement";
import PropertyReports from "@/pages/admin/PropertyReports";
import RolesAccessControl from "@/pages/admin/RolesAccessControl";
import BlogPost from "@/pages/admin/CreatePost";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Add Property", href: "/admin/add-property", icon: PlusCircle },
  { title: "Properties", href: "/admin/properties", icon: Building2 },
  { title: "Orders & Deals", href: "/admin/orders", icon: ShoppingCart },
  { title: "Blog Post", href: "/admin/blog-post", icon: Building2 },
  { title: "Leads", href: "/admin/leads", icon: Target },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "MLM System", href: "/admin/mlm-system", icon: Network },
  { title: "Commissions", href: "/admin/commissions", icon: DollarSign },
  { title: "Reports", href: "/admin/reports", icon: FileBarChart },
  { title: "Roles & Access", href: "/admin/roles", icon: ShieldCheck },
];

const AdminLayout = () => {
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
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink
              to="/admin/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span>Photon Platform</span>
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
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Building2 className="h-6 w-6 text-primary" />
                  <span>Photon Platform</span>
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
                  <AvatarImage src="https://avatar.iran.liara.run/public/1" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
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
          {/* === YAHAN PAR BADLAV KIYA GAYA HAI === */}
          {/* Outlet ki jagah hum ab yahan routes define karenge */}
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-property" element={<AddPropertyAdmin />} />
            <Route path="properties" element={<ManageProperties />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="leads" element={<ManageLeads />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="mlm-system" element={<MLMSystem />} />
            <Route path="commissions" element={<CommissionManagement />} />
            <Route path="reports" element={<PropertyReports />} />
            <Route path="roles" element={<RolesAccessControl />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="blog-post" element={<BlogPost />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
