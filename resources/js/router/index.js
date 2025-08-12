import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/layout';
import i18n from '@/lang';

import adminRoutes from './modules/admin';
import errorRoutes from './modules/error';
import merchantRoutes from './modules/merchant';
import storeRoutes from './modules/store';
import stockRoutes from './modules/stock';

export const constantRoutes = [
  {
    path: '/reset-password',
    component: () => import('@/views/login/ResetPassword'),
    hidden: true,
  },
  {
    path: '/do-reset-password',
    component: () => import('@/views/login/DoResetPassword'),
    hidden: true,
  },
  {
    path: '/404',
    redirect: { name: 'Page404' },
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/AuthRedirect'),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: 'dashboard/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: false },
      },
    ],
  },
  {
    path: '/change-password',
    component: Layout,
    redirect: 'change-password/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/ChangePassword'),
        name: 'change-password',
        meta: { title: 'Ubah Kata Sandi' },
      },
    ],
    hidden: true,
  },
  adminRoutes,
  errorRoutes,
  merchantRoutes,
  storeRoutes,
  {
    path: '/report',
    component: Layout,
    redirect: 'report/index',
    meta: { permissions: ['view menu report'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/report/index'),
        name: 'Report',
        meta: {
          title: i18n.t('sidebar.title.report'),
          icon: 'clipboard',
          noCache: false,
        },
      },
    ],
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    meta: { title: 'order', icon: 'table', permissions: ['view menu order'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/OrderTable'),
        name: 'Order',
        meta: { title: i18n.t('sidebar.title.order') },
      },
    ],
  },
  {
    path: '/refund',
    component: Layout,
    redirect: '/refund/index',
    meta: {
      title: 'Refund Order',
      icon: 'refund',
      permissions: ['view refund'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/refund/refundPage'),
        name: 'refund',
        meta: { title: 'Refund Order' },
      },
    ],
  },
  {
    path: '/delivery',
    component: Layout,
    redirect: '/delivery/index',
    meta: {
      title: 'Delivery Setting',
      icon: 'delivery',
      permissions: ['manage delivery'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/delivery/deliveryPage'),
        name: 'delivery',
        meta: { title: 'Delivery Setting' },
      },
    ],
  },
  stockRoutes,
  {
    path: '/audit-trail',
    component: Layout,
    redirect: '/audit-trail/index',
    meta: { title: 'Audit Trail', icon: 'audit-trail', permissions: ['view audit trail'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/audit-trail/index'),
        name: 'audit-trail',
        meta: { title: 'Audit Trail' },
      },
    ],
  },
  { path: '/', redirect: 'dashboard/index', hidden: true },
  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.MIX_LARAVUE_PATH,
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
