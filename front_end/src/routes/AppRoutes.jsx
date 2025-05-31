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
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </Suspense>
  );
}
import routes from './Routers';

export default AppRoutes;