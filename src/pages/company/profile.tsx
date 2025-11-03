// src/pages/company/profile.tsx

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

// Redux se user data nikalne ke liye
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

// Icons
import { FiUser, FiLock, FiCamera, FiLoader } from "react-icons/fi";

// Form ke data ke liye type
interface FormData {
  name: string;
  email: string;
  // Company ke liye extra fields add kar sakte hain
  // phone: string;
  // address: string;
}

const CompanyProfilePage = () => {
  // Redux se user data aur dispatch function get karein
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // Component ke local states
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [activeTab, setActiveTab] = useState<"details" | "security">("details");
  const [isSaving, setIsSaving] = useState(false);

  // Jab bhi Redux ka 'user' object badle, form data ko update karein
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Form input change ko handle karein
  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Profile details form submit karein
  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Yahan Redux thunk dispatch karein profile update karne ke liye
    // dispatch(updateUserDetails({ userId: user.id, data: formData }));
    console.log("Updating profile with:", formData);
    setTimeout(() => {
      alert("Profile details updated successfully! (Simulated)");
      setIsSaving(false);
    }, 1500);
  };

  // Password change form submit karein
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New and confirm passwords do not match!");
      return;
    }
    setIsSaving(true);
    // TODO: Yahan Redux thunk dispatch karein password change ke liye
    // dispatch(changePassword({ currentPassword: passwords.current, newPassword: passwords.new }));
    console.log("Changing password...");
    setTimeout(() => {
      alert("Password changed successfully! (Simulated)");
      setPasswords({ current: "", new: "", confirm: "" });
      setIsSaving(false);
    }, 1500);
  };

  // Agar user data load ho raha hai ya nahi hai, to loader ya message dikhayein
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <FiLoader className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={`https://avatar.iran.liara.run/public/boy?username=${user.email}`}
                alt="Profile Avatar"
                className="rounded-full w-full h-full object-cover border-4 border-gray-200"
              />
              <button className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-2 hover:bg-red-700">
                <FiCamera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <span className="mt-2 inline-block bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "details" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-red-600"}`}
              >
                <FiUser /> Profile Details
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "security" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-red-600"}`}
              >
                <FiLock /> Security
              </button>
            </div>

            <div className="p-6">
              {activeTab === "details" ? (
                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleDetailsChange}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="mt-1 block w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2 min-w-[140px] justify-center"
                    >
                      {isSaving ? <FiLoader className="animate-spin" /> : null}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2 min-w-[180px] justify-center"
                    >
                      {isSaving ? <FiLoader className="animate-spin" /> : null}
                      {isSaving ? "Saving..." : "Change Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
