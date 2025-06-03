import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Store from '../Pages/Store';
import WishList from '../Pages/WishList';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';
import SellerDashboard from '../Pages/SellerDashboard';
import CourseForm from '../Pages/CourseForm';
import ProductDetail from '../Pages/ProductDetail';
import CourseVideo from '../Pages/CourseVideo';
import UserInfo from '../Pages/UserInfo';
import SendEmail from '../Pages/SendEmail';
import Payment from '../Pages/Payment';
import Authentication from '../Pages/Authentication';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/store',
    element: <Store />,
  },
  {
    path: '/wishlist',
    element: <WishList />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/seller/dashboard',
    element: <SellerDashboard />,
  },
  {
    path: '/seller/course/new',
    element: <CourseForm />,
  },
  {
    path: '/seller/course/:id/edit',
    element: <CourseForm />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/course/:id/video',
    element: <CourseVideo />,
  },
  {
    path: '/user/info',
    element: <UserInfo />,
  },
  {
    path: '/send-email',
    element: <SendEmail />,
  },
  {
    path: '/payment',
    element: <Payment />,
  },
  {
    path: '/authentication',
    element: <Authentication />,
  },
]);

export default router; 