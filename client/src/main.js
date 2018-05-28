// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import Bus from './util/bus'
import ElementUI from 'element-ui'
import DataTables, { DataTablesServer } from 'vue-data-tables'
import locale from 'element-ui/lib/locale/lang/en'
import './global.scss';
import App from './App'

Vue.use(Bus)
Vue.use(ElementUI, { locale })
Vue.use(DataTablesServer)
Vue.use(DataTables)
Vue.config.productionTip = false
Vue.prototype.echarts = window.echarts;
Vue.prototype.THREE = window.THREE;

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth) && !store.getters.user) {
    axios
      .get('/user')
      .then(res => {
        if (res && res.data) {
          store.commit('updateUser', res.data);
          next();
        } else {
          next({
            path: 'login',
            query: { returnUrl: to.name }
          });
        }
      })
      .catch(err => console.log(err));
  } else {
    next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
