import { createRouter, createWebHistory } from 'vue-router';

// Importación de vistas
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import CartView from '../views/CartView.vue';
import GuiaView from '../views/GuiaView.vue';
import ContactView from '../views/ContactView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import SobreNosotrosView from '../views/SobreNosotrosView.vue';
import ConfirmarPedido from '../views/ConfirmarPedidoView.vue';
import PedidoDetalle from '../views/PedidoDetalleView.vue';
import MiCuenta from '../views/MiCuentaView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/shop', name: 'Products', component: ProductsView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/pedido-confirmacion', component: ConfirmarPedido },
  { path: '/pedido-detalle/:id', component: PedidoDetalle, props: true },
  { path: '/guia', name: 'Guia', component: GuiaView },
  { path: '/contacto', name: 'Contact', component: ContactView },
  { path: '/sobre-nosotros', name: 'SobreNosotros', component: SobreNosotrosView },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView, props: true },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/mi-cuenta', name: 'MiCuenta', component: MiCuenta },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;
