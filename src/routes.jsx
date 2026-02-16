import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import PlantDetails from './pages/PlantDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/admin-login', component: AdminLogin },
  { path: '/admin/forgot-password', component: AdminForgotPassword },
  { path: '/admin/reset-password', component: AdminResetPassword },
  { path: '/plants/:id', component: PlantDetails },
  { path: '/cart', component: Cart, protected: true },
  { path: '/orders', component: Orders, protected: true },
  { path: '/orders/:orderId', component: OrderDetails, protected: true },
  { path: '/admin/dashboard', component: AdminDashboard, protected: true, adminOnly: true }
];

export default routes;