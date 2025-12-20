import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import App from './App.vue';
import VueDatepickerNext from '../src/index.js';

// 设置 moment 语言
moment.locale('zh-cn');

// 使用组件
Vue.use(VueDatepickerNext);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
