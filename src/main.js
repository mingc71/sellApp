// 这是对应APP.vue的js文件
import Vue from 'vue';
// 需要下载vue依赖,在用import导入
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
// Vue.use()注册/安装这个插件
Vue.use(VueRouter);
Vue.use(VueResource);

var routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
  { path: '/*', redirect: '/goods' }
];
var router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app');

