import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import propertyReducer from "./features/properties/propertySlice";
import userReducer from "./features/users/userSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import inquiryReducer from "./features/inquiries/inquirySlice";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import commisionReducer from "./features/commissions/commissionSlice";
import reportReducer from "./features/reports/reportsSlice";
import salesReducer from "./features/sales/saleSlice";
import rolesReducer from "./features/roles/roleSlice";
import leadsReducer from "./features/leads/leadSlice";
import dashboardReducer1 from "./features/dashboard1/dashboardSlice1";
import contactReducer from "./features/contact/contactSlice";
import blogReducer from "./features/blog/blogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    users: userReducer,
    wishlist: wishlistReducer,
    inquiries: inquiryReducer,
    dashboard: dashboardReducer,
    commissions: commisionReducer,
    reports: reportReducer,
    sales: salesReducer,
    roles: rolesReducer,
    leads: leadsReducer,
    dashboard1: dashboardReducer1,
    contact: contactReducer,
    blog: blogReducer,
  },

  devTools: process.env.NODE_ENV !== "production",
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
