import type { FC } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import UserLayout from "./components/users/UserLayout";
import BrokerLayout from "./components/broker/BrokerLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Commercial from "./pages/Commercial";
import NewProjects from "./pages/NewProjects";
import PropertyServices from "./pages/PropertyServices";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Press from "./pages/Press";
import Careers from "./pages/Careers";
import InvestorRelations from "./pages/InvestorRelations";
import HomeLoans from "./pages/HomeLoans";
import PropertyManagement from "./pages/PropertyManagement";
import LegalServices from "./pages/LegalServices";
import InteriorDesign from "./pages/InteriorDesign";
import ServicesLayout from "./pages/ServicesLayout";

import AdminDashboard from "./pages/admin/dashboard";
import ManageProperties from "./pages/admin/ManageProperties";
import AddPropertyAdmin from "./pages/admin/AddProperty";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageLeads from "./pages/admin/ManageLeads";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBrokers from "./pages/admin/ManageBrokers";
import Settings from "./pages/admin/Settings";

import UserDashboard from "./pages/users/dashboard";
import SavedProperties from "./pages/users/SavedProperties";
import UserProfile from "./pages/users/Profile";

import BrokerDashboard from "./pages/brokers/Dashboard";
import MyProperties from "./pages/brokers/MyProperties";
import AddPropertyBroker from "./pages/brokers/AddPropertyBroker";
import Enquiries from "./pages/brokers/Enquiries";
import BrokerProfile from "./pages/brokers/Profile";

import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/commercial" element={<Commercial />} />
                <Route path="/new-projects" element={<NewProjects />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="/property-services"
                  element={<PropertyServices />}
                />
                <Route path="/auth" element={<Auth />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/press" element={<Press />} />
                <Route path="/careers" element={<Careers />} />
                <Route
                  path="/investor-relations"
                  element={<InvestorRelations />}
                />
                <Route path="/services" element={<ServicesLayout />}>
                  <Route index element={<HomeLoans />} />
                  <Route path="home-loans" element={<HomeLoans />} />
                  <Route
                    path="property-management"
                    element={<PropertyManagement />}
                  />
                  <Route path="legal-services" element={<LegalServices />} />
                  <Route path="interior-design" element={<InteriorDesign />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="properties" element={<ManageProperties />} />
                  <Route path="properties/add" element={<AddPropertyAdmin />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="leads" element={<ManageLeads />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="brokers" element={<ManageBrokers />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="/users" element={<UserLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route
                    path="saved-properties"
                    element={<SavedProperties />}
                  />
                  <Route path="profile" element={<UserProfile />} />
                </Route>

                <Route path="/broker" element={<BrokerLayout />}>
                  <Route index element={<BrokerDashboard />} />
                  <Route path="dashboard" element={<BrokerDashboard />} />
                  <Route path="properties" element={<MyProperties />} />
                  <Route
                    path="/broker/properties/add"
                    element={<AddPropertyBroker />}
                  />

                  <Route
                    path="properties/add"
                    element={<AddPropertyBroker />}
                  />
                  <Route path="enquiries" element={<Enquiries />} />
                  <Route path="profile" element={<BrokerProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
