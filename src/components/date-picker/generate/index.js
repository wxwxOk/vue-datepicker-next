/**
 * GenerateConfig - 日期库适配器接口定义
 * 用于抽象不同日期库 (moment, dayjs, date-fns) 的操作
 */

/**
 * @typedef {Object} GenerateConfig
 * @property {function(): DateType} getNow - 获取当前日期
 * @property {function(DateType): number} getYear - 获取年份
 * @property {function(DateType): number} getMonth - 获取月份 (0-11)
 * @property {function(DateType): number} getDate - 获取日期 (1-31)
 * @property {function(DateType): number} getHour - 获取小时
 * @property {function(DateType): number} getMinute - 获取分钟
 * @property {function(DateType): number} getSecond - 获取秒
 * @property {function(DateType): number} getWeekDay - 获取星期几 (0-6)
 * @property {function(DateType, number): DateType} addYear - 增加年份
 * @property {function(DateType, number): DateType} addMonth - 增加月份
 * @property {function(DateType, number): DateType} addDate - 增加天数
 * @property {function(DateType, number): DateType} setYear - 设置年份
 * @property {function(DateType, number): DateType} setMonth - 设置月份
 * @property {function(DateType, number): DateType} setDate - 设置日期
 * @property {function(DateType, number): DateType} setHour - 设置小时
 * @property {function(DateType, number): DateType} setMinute - 设置分钟
 * @property {function(DateType, number): DateType} setSecond - 设置秒
 * @property {function(DateType, DateType): boolean} isAfter - 比较是否在之后
 * @property {function(DateType, DateType): boolean} isBefore - 比较是否在之前
 * @property {function(DateType, DateType): boolean} isSame - 比较是否相同
 * @property {function(DateType): boolean} isValidate - 验证是否有效
 * @property {function(any): boolean} isDateType - 检查是否为日期类型实例
 * @property {function(string|DateType, string): DateType} toDate - 转换为日期对象
 * @property {function(DateType, string): string} toString - 转换为字符串
 * @property {function(DateType): DateType} clone - 克隆日期对象
 * @property {Object} locale - 国际化操作
 * @property {function(string, DateType): number} locale.getWeekFirstDay - 获取一周第一天
 * @property {function(string, DateType, string): string} locale.format - 格式化日期
 * @property {function(string, string, string[]): DateType|null} locale.parse - 解析日期字符串
 */

// 默认配置，将在运行时被设置
let currentGenerateConfig = null;

/**
 * 设置当前使用的日期库配置
 * @param {GenerateConfig} config - 日期库配置
 */
export function setGenerateConfig(config) {
  currentGenerateConfig = config;
}

/**
 * 获取当前使用的日期库配置
 * @returns {GenerateConfig} 当前日期库配置
 */
export function getGenerateConfig() {
  if (!currentGenerateConfig) {
    // 延迟加载默认的 moment 配置
    const momentConfig = require('./moment').default;
    currentGenerateConfig = momentConfig;
  }
  return currentGenerateConfig;
}

/**
 * 创建适配器接口的工厂函数
 * 用于验证适配器实现是否完整
 * @param {Object} config - 适配器配置
 * @returns {GenerateConfig} 验证后的配置
 */
export function createGenerateConfig(config) {
  const requiredMethods = [
    'getNow',
    'getYear',
    'getMonth',
    'getDate',
    'getHour',
    'getMinute',
    'getSecond',
    'getWeekDay',
    'addYear',
    'addMonth',
    'addDate',
    'setYear',
    'setMonth',
    'setDate',
    'setHour',
    'setMinute',
    'setSecond',
    'isAfter',
    'isBefore',
    'isSame',
    'isValidate',
    'isDateType',
    'toDate',
    'toString',
    'clone',
  ];

  const requiredLocale = ['getWeekFirstDay', 'format', 'parse'];

  // 验证必需方法
  requiredMethods.forEach(method => {
    if (typeof config[method] !== 'function') {
      console.warn(`[GenerateConfig] Missing required method: ${method}`);
    }
  });

  // 验证 locale 方法
  if (config.locale) {
    requiredLocale.forEach(method => {
      if (typeof config.locale[method] !== 'function') {
        console.warn(`[GenerateConfig] Missing required locale method: ${method}`);
      }
    });
  } else {
    console.warn('[GenerateConfig] Missing locale object');
  }

  return config;
}

export default {
  setGenerateConfig,
  getGenerateConfig,
  createGenerateConfig,
};
