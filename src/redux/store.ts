import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import propertyReducer from "./features/properties/propertySlice";
import userReducer from "./features/users/userSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import inquiryReducer from "./features/inquiries/inquirySlice";
import dashboardReducer from "./features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    users: userReducer,
    wishlist: wishlistReducer,
    inquiries: inquiryReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
