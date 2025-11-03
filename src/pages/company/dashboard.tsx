import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getCompanyDashboardStats,
  getRecentProperties,
  getRecentLeads,
} from "@/redux/features/dashboard/dashboardSlice";
import {
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiBarChart2,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMoreVertical,
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: "increase" | "decrease";
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className="bg-gray-100 text-gray-700 p-3 rounded-full">{icon}</div>
    </div>
    <div className="flex items-center mt-4 text-xs">
      {changeType === "increase" ? (
        <FiArrowUpRight className="text-green-500" />
      ) : (
        <FiArrowDownRight className="text-red-500" />
      )}
      <span
        className={`ml-1 font-semibold ${
          changeType === "increase" ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}%
      </span>
      <span className="ml-1 text-gray-500">vs last month</span>
    </div>
  </div>
);

const CompanyDashboard = () => {
  const dispatch = useAppDispatch();

  const {
    companyStats: stats,
    recentProperties,
    recentLeads,
    isLoading,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getCompanyDashboardStats());
    dispatch(getRecentProperties());
    dispatch(getRecentLeads());
  }, [dispatch]);

  const formatCurrency = (value: number) => {
    if (typeof value !== "number") return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Hi, Welcome back 👋</h1>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your properties today.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="My Properties"
              value={(stats.totalProperties ?? 0).toString()}
              icon={<FiHome size={22} />}
              change="5.2"
              changeType="increase"
            />
            <StatCard
              title="My Sales (Month)"
              value={formatCurrency(stats.totalSalesMonth ?? 0)}
              icon={<FiTrendingUp size={22} />}
              change="12.5"
              changeType="increase"
            />
            <StatCard
              title="New Leads (Month)"
              value={(stats.newLeadsMonth ?? 0).toString()}
              icon={<FiUsers size={22} />}
              change="2.1"
              changeType="decrease"
            />
            <StatCard
              title="Reports Generated"
              value={(stats.reportsGenerated ?? 0).toString()}
              icon={<FiBarChart2 size={22} />}
              change="8"
              changeType="increase"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              My Recent Properties
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 font-medium">
                  <tr className="border-b">
                    <th className="p-3">Property</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentProperties || []).map((prop) => (
                    <tr key={prop._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 mr-4 flex-shrink-0"></div>
                        <span className="font-semibold text-gray-800">
                          {prop.title}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {prop.location.city}
                      </td>
                      <td className="p-3 font-medium text-gray-700">
                        {formatCurrency(prop.price)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            prop.status === "Sold"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              My Recent Leads
            </h2>
            <div className="space-y-5">
              {(recentLeads || []).map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lead.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Interested in: {lead.property?.title ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700">
                    <FiMoreVertical />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
