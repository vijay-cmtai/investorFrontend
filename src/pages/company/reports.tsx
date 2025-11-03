// src/pages/company/reports.tsx
import React, { useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllSales, Sale } from "@/redux/features/sales/saleSlice";

const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { sales, isLoading, isError, message } = useSelector(
    (state: RootState) => state.sales
  );

  useEffect(() => {
    dispatch(getAllSales());
  }, [dispatch]);

  const handleDownload = (sale: Sale) => {
    const headers =
      "Property Title,Buyer Name,Buyer Email,Sale Price,Sale Date\n";
    const row = [
      `"${sale.property?.title ?? "N/A"}"`,
      `"${sale.buyer?.name ?? "N/A"}"`,
      `"${sale.buyer?.email ?? "N/A"}"`,
      sale.salePrice,
      new Date(sale.saleDate).toLocaleDateString(),
    ].join(",");

    const csvContent = headers + row;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sale-report-${sale._id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-red-500">Error: {message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Reports</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Generate New Report
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Available Sales Reports
        </h2>
        {sales.length > 0 ? (
          <ul className="space-y-4">
            {sales.map((sale) => (
              <li
                key={sale._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Sale of:{" "}
                    {sale.property?.title ?? "Property Information Missing"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Buyer:{" "}
                    <span className="font-medium">
                      {sale.buyer?.name ?? "Unknown Buyer"}
                    </span>{" "}
                    | Sold on: {new Date(sale.saleDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(sale)}
                  className="mt-3 sm:mt-0 text-red-600 hover:text-red-800 flex items-center font-semibold"
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sales reports found.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
