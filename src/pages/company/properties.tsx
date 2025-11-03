import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getProperties,
  deleteProperty,
} from "@/redux/features/properties/propertySlice";
import { FiTrash2, FiPlusCircle, FiEdit } from "react-icons/fi";

const PropertiesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, isLoading, isError, message } = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteProperty(id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading && properties.length === 0) {
    return <div className="p-8 text-center">Loading properties...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Error: {message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center shadow-md transition-transform transform hover:scale-105">
          <FiPlusCircle className="mr-2" />
          Add New Property
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 font-medium">
              <tr className="border-b-2 border-gray-200">
                <th className="p-3">Property Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((prop) => (
                  <tr key={prop._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">
                      {prop.title}
                    </td>
                    <td className="p-3 text-gray-600">{prop.location.city}</td>
                    <td className="p-3 font-medium text-gray-700">
                      {formatCurrency(prop.price)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          prop.status === "Sold"
                            ? "bg-red-100 text-red-800"
                            : prop.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-blue-500 hover:text-blue-700 mr-4">
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(prop._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
