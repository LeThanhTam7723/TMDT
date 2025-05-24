// src/routes.js
import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('../Pages/HomePage')),
  },
  {
    path: '/shop',
    component: lazy(() => import('../Pages/Store')),
  },
  {
    path: '/product_detail/:id',
    component: lazy(() => import('../Pages/ProductDetail')),
  },
  {
    path: '/cart',
    component: lazy(() => import('../Pages/Cart')),
  },
  {
    path: '/payment',
    component: lazy(() => import('../Pages/Payment')),
  },
  {
    path: '/auth/*',
    component: lazy(() => import('../Pages/Authentication')),
  },
  {
    path: '/profile',
    component: ('../Pages/Profile'),
  }
];

export default routes;