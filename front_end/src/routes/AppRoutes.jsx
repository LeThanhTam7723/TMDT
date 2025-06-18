// src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/HomePage';
import Store from '../Pages/Store';

import Cart from '../Pages/Cart'
import CheckoutPage from '../Pages/Payment'
import AuthPage from '../Pages/Authentication'
import Detail from '../Pages/Detail';
import UserInfo from '../Pages/UserInfo';
import CourseVideo from '../Pages/CourseVideo';
import SellerDashboard from '../Pages/SellerDashboard';
import CourseForm from '../Pages/CourseForm';
import Favorite from '../Pages/Favorite';
import Checkout from '../Pages/Checkout';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ChatInterface from '../Pages/Chat';

import Analytics from '../Pages/Admin/AdminDashboard'; 
import UserManagement from '../Pages/Admin/UserManagement'; 
import CourseAnalytics from '../Pages/Admin/CourseAnalytics'; 
import ComplaintManagement from '../Pages/Admin/ComplaintManagement'; 

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
        <Route path="/video/:id" element={<CourseVideo />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatInterface />} />
       
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/course/new" element={<CourseForm />} />
        <Route path="/seller/course/:id/edit" element={<CourseForm />} />
        {/* {Admin route} */}
                {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Analytics />} />
        <Route path="/admin/analytics" element={<Analytics />} />
         <Route path="/admin/UserManagement" element={<UserManagement />} />
          <Route path="/admin/CourseAnalytics" element={<CourseAnalytics />} />
         <Route path="/admin/ComplaintManagement" element={<ComplaintManagement />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;