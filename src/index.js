/**
 * Vue DatePicker Next
 * A powerful Vue 2.x DatePicker component based on Ant Design Vue
 */

import DatePicker from './components/date-picker';
import antDirective from './components/_util/antDirective';
import './components/style/index.less';
import './components/date-picker/style/index.less';

const { RangePicker, MonthPicker, WeekPicker } = DatePicker;

// 导出日期库适配器
export { setGenerateConfig, getGenerateConfig } from './components/date-picker/generate';
export { default as momentGenerateConfig } from './components/date-picker/generate/moment';
export { default as dayjsGenerateConfig } from './components/date-picker/generate/dayjs';

// 安装函数
const install = function(Vue) {
  // 注册所有指令 (ant-ref, ant-input, ant-decorator, ant-portal)
  Vue.use(antDirective);

  Vue.component(DatePicker.name, DatePicker);
  Vue.component('a-date-picker', DatePicker);
  Vue.component('a-range-picker', RangePicker);
  Vue.component('a-month-picker', MonthPicker);
  Vue.component('a-week-picker', WeekPicker);
};

// 自动安装（如果是在浏览器环境）
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  DatePicker,
  RangePicker,
  MonthPicker,
  WeekPicker,
};

export default {
  install,
  DatePicker,
  RangePicker,
  MonthPicker,
  WeekPicker,
};
