// src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/HomePage';
import Store from '../Pages/Store';
import ProductDetail from '../Pages/ProductDetail';
import Cart from '../Pages/Cart'
import CheckoutPage from '../Pages/Payment'
import AuthPage from '../Pages/Authentication'
import Detail from '../Pages/Detail';
import UserInfo from '../Pages/UserInfo';
import CourseVideo from '../Pages/CourseVideo';
import SellerDashboard from '../Pages/SellerDashboard';
import CourseForm from '../Pages/CourseForm';
import Wishlist from '../Pages/Wishlist';
import Checkout from '../Pages/Checkout';
import Login from '../Pages/Login';
import Register from '../Pages/Register';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Store />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<CheckoutPage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/video/:id" element={<CourseVideo />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/course/new" element={<CourseForm />} />
        <Route path="/seller/course/:id/edit" element={<CourseForm />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;