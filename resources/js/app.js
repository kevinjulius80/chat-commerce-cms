import '@/styles/index.scss';
import 'core-js';
import Vue from 'vue';
import Cookies from 'js-cookie';
import ElementUI from 'element-ui';
import App from './views/App';
import store from './store';
import router from '@/router';
import i18n from './lang'; // Internationalization
import '@/icons'; // icon
import '@/permission'; // permission control
import { isLogged } from '@/utils/auth';
import { NotificationPermission } from '@/utils/pushNotif';

import * as filters from './filters'; // global filters

import * as GmapVue from 'gmap-vue';
import VueHtml2Canvas from 'vue-html2canvas';

import VueMoment from 'vue-moment';
import moment from 'moment-timezone';

import JsonCSV from 'vue-json-csv';
Vue.component('downloadCsv', JsonCSV);

Vue.use(GmapVue, {
  load: {
    key: process.env.MIX_GEOCODER_API_KEY,
    libraries: 'places',
  },
  installComponents: true,
});

Vue.use(VueHtml2Canvas);
Vue.use(VueMoment, {
  moment,
});

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// check if user is logged in and the page is not dashboard
// because we already handle notification when first load ini dashboard
if (isLogged() && !window.location.toString().includes('dashboard')) {
  NotificationPermission();
}

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
});
