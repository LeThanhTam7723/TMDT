import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/HomePage";
import Store from "../Pages/Store";
import Cart from "../Pages/Cart";
import CheckoutPage from "../Pages/Payment";
import AuthPage from "../Pages/Authentication";
import Detail from "../Pages/Detail";
import UserInfo from "../Pages/UserInfo";
import CourseVideo from "../Pages/CourseVideo";
import SellerDashboard from "../Pages/SellerDashboard";
import CourseForm from "../Pages/CourseForm";
import Favorite from "../Pages/Favorite";
import Checkout from "../Pages/Checkout";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ChatInterface from "../Pages/Chat";
import SellerDetail from "../Pages/SellerDetail";

import Analytics from "../Pages/Admin/AdminDashboard";
import UserManagement from "../Pages/Admin/UserManagement";
import CourseAnalytics from "../Pages/Admin/CourseAnalytics";
import ComplaintManagement from "../Pages/Admin/ComplaintManagement";
import AdminCourseApproval from "../Pages/Admin/AdminCourseApproval";
import ProtectedRoute from "../component/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Store />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<CheckoutPage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/course-video/:id" element={<CourseVideo />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/seller/:id" element={<SellerDetail />} />

        {/* Seller Routes - Only SELLER and ADMIN can access */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/course/new"
          element={
            <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
              <CourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/course/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
              <CourseForm />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Only ADMIN can access */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/UserManagement"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/CourseAnalytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CourseAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ComplaintManagement"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ComplaintManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course-approval"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCourseApproval />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
