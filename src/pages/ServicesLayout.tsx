import { NavLink, Outlet } from "react-router-dom";
import {
  Landmark,
  Home,
  Gavel,
  Paintbrush,
  Shield,
  ArrowRight,
} from "lucide-react";

const serviceLinks = [
  { name: "Home Loans", path: "/services/home-loans", icon: Landmark },
  {
    name: "Property Management",
    path: "/services/property-management",
    icon: Home,
  },
  { name: "Legal Services", path: "/services/legal-services", icon: Gavel },
  {
    name: "Interior Design",
    path: "/services/interior-design",
    icon: Paintbrush,
  },
  {
    name: "Property Insurance",
    path: "/services/property-insurance",
    icon: Shield,
  },
];

const ServicesLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-card p-4 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-foreground px-2">
              Our Services
            </h2>
            <nav className="flex flex-col space-y-1">
              {serviceLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesLayout;
