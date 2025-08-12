import Layout from '@/layout';
import i18n from '@/lang';
// import Router from 'vue-router';
// import { Message } from 'element-ui';

const storeRoutes = {
  path: '/store',
  component: Layout,
  redirect: '/store/stock',
  name: 'Store Setting',
  alwaysShow: true,
  meta: {
    title: i18n.t('sidebar.title.store'),
    icon: 'building',
    permissions: ['view menu store'],
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/food/Category'),
      name: 'FoodCategory',
      meta: { title: i18n.t('sidebar.children.category'), icon: 'fast-food', permissions: ['view menu food'] },
    },
    {
      path: 'menu',
      component: () => import('@/views/food/Menu'),
      name: 'FoodMenu',
      meta: { title: i18n.t('sidebar.children.menu'), icon: 'restaurant-menu', permissions: ['view menu food'] },
    },
    // {
    //   path: 'stock',
    //   component: () => import('@/views/setting/Stock'),
    //   name: 'PriceAndStock',
    //   meta: { title: 'Price and Stock', icon: 'dollar', permissions: ['view menu stock'] },
    // },
    {
      path: 'opshour',
      component: () => import('@/views/setting/OpsHour'),
      name: 'OperationalHour',
      meta: { title: i18n.t('sidebar.children.operational_hour'), icon: 'example', permissions: ['view menu service'] },
    },
    {
      path: 'fee',
      component: () => import('@/views/setting/Fee'),
      name: 'Fee',
      meta: { title: i18n.t('sidebar.children.fees'), icon: 'dollar', permissions: ['view menu fee'] },
    },
    {
      path: 'payment',
      component: () => import('@/views/setting/StorePayment'),
      name: 'StorePaymentSetting',
      meta: { title: i18n.t('sidebar.children.payment'), icon: 'dollar', permissions: ['view menu crud store'] },
    },
    //     {
    //       path: 'copy',
    //       component: async() => {
    //         const reference_id = localStorage.getItem('store_reference_id');
    //         const StoreName = localStorage.getItem('store_name');
    //         const textCopy = `Halo! Kamu bisa berbelanja di ${StoreName} melalui BerandaToko dengan klik link ${process.env.MIX_MICROSITE_URL + '/a/' + reference_id}

    // Untuk bantuan CS, dapat menghubungi ke WhatsApp: https://wa.me/6281385026781?text=Hai_Admin_Beranda_Toko

    // Selamat berbelanja!`;
    //         try {
    //           await navigator.clipboard.writeText(textCopy);
    //           Message({
    //             message: i18n.t('store.toaster.copy.success'),
    //             type: 'success',
    //             duration: 5 * 1000,
    //           });
    //         } catch ($e) {
    //           Message({
    //             message: i18n.t('store.toaster.copy.failed'),
    //             type: 'error',
    //             duration: 5 * 1000,
    //           });
    //         }
    //       },
    //       name: 'CopyLinkStore',
    //       meta: { title: i18n.t('sidebar.children.copy'), icon: 'share', permissions: ['view menu crud store'] },
    //     },
  ],
};

export default storeRoutes;
