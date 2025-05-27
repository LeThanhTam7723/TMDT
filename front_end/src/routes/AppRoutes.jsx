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


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Store />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/payment" element={<CheckoutPage/>} />
      <Route path="/login" element={<AuthPage/>} />
       <Route path="/detail" element={<Detail />} />
      <Route path="/info" element = {<UserInfo/>}/>
      <Route path="/video" element = {<CourseVideo/>}/>
    </Routes>
  );
}

export default AppRoutes;