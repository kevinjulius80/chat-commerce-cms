import Layout from '@/layout';
import i18n from '@/lang';

const stockRoutes = {
  path: '/stock',
  component: Layout,
  redirect: '/stock/setting',
  name: 'Monitoring Stock',
  alwaysShow: true,
  meta: {
    title: i18n.t('sidebar.title.stock'),
    icon: 'building',
    permissions: ['view menu stock'],
  },
  children: [
    {
      path: 'setting',
      component: () => import('@/views/stock/Setting'),
      name: 'SettingMonitoringStock',
      meta: {
        title: i18n.t('sidebar.children.stock_setting'),
        icon: 'admin',
        permissions: ['view menu stock'],
      },
    },
    {
      path: 'empty',
      component: () => import('@/views/stock/Empty'),
      name: 'EmptyStock',
      meta: {
        title: i18n.t('sidebar.children.stock_empty'),
        icon: 'close',
        permissions: ['view menu stock'],
      },
    },
    {
      path: 'low',
      component: () => import('@/views/stock/Low'),
      name: 'LowStock',
      meta: {
        title: i18n.t('sidebar.children.stock_low'),
        icon: 'warning',
        permissions: ['view menu stock'],
      },
    },
    {
      path: 'not-sold',
      component: () => import('@/views/stock/NotSold'),
      name: 'NotSoldItem',
      meta: {
        title: i18n.t('sidebar.children.not_sold'),
        icon: 'dislike',
        permissions: ['view menu stock'],
      },
    },
  ],
};

export default stockRoutes;
