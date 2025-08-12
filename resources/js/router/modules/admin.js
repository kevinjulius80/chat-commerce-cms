import Layout from '@/layout';
import i18n from '@/lang';

const adminRoutes = {
  path: '/administrator',
  component: Layout,
  redirect: '/administrator/users',
  name: 'Administrator',
  alwaysShow: true,
  meta: {
    title: i18n.t('sidebar.title.administrator'),
    icon: 'admin',
    permissions: ['view menu administrator'],
  },
  children: [
    {
      path: 'users',
      component: () => import('@/views/users/List'),
      name: 'UserList',
      meta: { title: i18n.t('sidebar.children.user'), icon: 'user', permissions: ['view menu user'] },
    },
    {
      path: 'roles',
      component: () => import('@/views/role-permission/List'),
      name: 'RoleList',
      meta: { title: i18n.t('sidebar.children.role'), icon: 'role', permissions: ['view menu permission'] },
    },
    {
      path: 'merchant',
      component: () => import('@/views/merchant/List'),
      name: 'MerchantList',
      meta: { title: i18n.t('sidebar.children.merchant'), icon: 'building', permissions: ['view menu crud merchant'] },
    },
    {
      path: 'customer',
      component: () => import('@/views/customer/List'),
      name: 'CustomerList',
      meta: { title: i18n.t('sidebar.children.customer'), icon: 'user', permissions: ['view menu customer'] },
    },
  ],
};

export default adminRoutes;
