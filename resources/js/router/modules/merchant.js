/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout';
import i18n from '@/lang';

const merchantRoutes = {
  path: '/merchant',
  component: Layout,
  redirect: '/merchant/store',
  name: 'MerchantSetting',
  alwaysShow: true,
  meta: {
    title: i18n.t('sidebar.title.merchant'),
    icon: 'food-basket',
    permissions: ['view menu merchant'],
  },
  children: [
    {
      path: 'store',
      component: () => import('@/views/store/List'),
      name: 'StoreList',
      meta: { title: i18n.t('sidebar.children.store'), icon: 'building', permissions: ['view menu crud store'] },
    },
    {
      path: 'faq',
      component: () => import('@/views/setting/Faq'),
      name: 'FAQ',
      meta: { title: i18n.t('sidebar.children.faq'), icon: 'wechat', permissions: ['view menu faq'] },
    },
  ],
};

export default merchantRoutes;
