/**
 * DatePicker 工具函数
 * 支持日期库适配器模式
 */

import { getGenerateConfig, setGenerateConfig } from './generate';
import momentGenerateConfig from './generate/moment';

// 导出适配器管理函数
export { getGenerateConfig, setGenerateConfig };

// 默认使用 moment 适配器
setGenerateConfig(momentGenerateConfig);

/**
 * 格式化日期
 * @param {any} value - 日期值
 * @param {string|string[]|function} format - 格式字符串或格式化函数
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(value, format) {
  if (!value) {
    return '';
  }
  if (Array.isArray(format)) {
    format = format[0];
  }
  if (typeof format === 'function') {
    const result = format(value);
    if (typeof result === 'string') {
      return result;
    } else {
      throw new Error('The function of format does not return a string');
    }
  }

  const config = getGenerateConfig();
  return config.toString(value, format);
}

/**
 * 解析日期字符串
 * @param {string} text - 日期字符串
 * @param {string|string[]} format - 格式字符串
 * @returns {any} 解析后的日期对象
 */
export function parseDate(text, format) {
  if (!text) {
    return null;
  }
  const config = getGenerateConfig();
  const formats = Array.isArray(format) ? format : [format];
  return config.locale.parse('en', text, formats);
}

/**
 * 检查值是否为有效的日期类型
 * @param {any} value - 待检查的值
 * @returns {boolean} 是否为日期类型
 */
export function isDateType(value) {
  const config = getGenerateConfig();
  return config.isDateType(value);
}

/**
 * 检查日期是否有效
 * @param {any} value - 日期值
 * @returns {boolean} 是否有效
 */
export function isValidDate(value) {
  if (!value) {
    return false;
  }
  const config = getGenerateConfig();
  return config.isValidate(value);
}

/**
 * 获取当前日期
 * @returns {any} 当前日期
 */
export function getNow() {
  const config = getGenerateConfig();
  return config.getNow();
}

/**
 * 克隆日期
 * @param {any} date - 日期值
 * @returns {any} 克隆后的日期
 */
export function cloneDate(date) {
  if (!date) {
    return null;
  }
  const config = getGenerateConfig();
  return config.clone(date);
}

/**
 * 比较两个日期是否相同
 * @param {any} date1 - 日期1
 * @param {any} date2 - 日期2
 * @param {string} type - 比较类型 (year/month/day/hour/minute/second)
 * @returns {boolean} 是否相同
 */
export function isSameDate(date1, date2, type = 'day') {
  if (!date1 || !date2) {
    return false;
  }
  const config = getGenerateConfig();
  return config.isSame(date1, date2, type);
}

/**
 * 判断日期1是否在日期2之后
 * @param {any} date1 - 日期1
 * @param {any} date2 - 日期2
 * @returns {boolean}
 */
export function isAfterDate(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  const config = getGenerateConfig();
  return config.isAfter(date1, date2);
}

/**
 * 判断日期1是否在日期2之前
 * @param {any} date1 - 日期1
 * @param {any} date2 - 日期2
 * @returns {boolean}
 */
export function isBeforeDate(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  const config = getGenerateConfig();
  return config.isBefore(date1, date2);
}

/**
 * 转换为日期对象
 * @param {any} value - 输入值
 * @param {string} format - 格式字符串
 * @returns {any} 日期对象
 */
export function toDate(value, format) {
  if (!value) {
    return null;
  }
  const config = getGenerateConfig();
  return config.toDate(value, format);
}

/**
 * 获取月份的开始日期
 * @param {any} date - 日期
 * @returns {any} 月份开始日期
 */
export function getStartOfMonth(date) {
  const config = getGenerateConfig();
  return config.getStartOfMonth(date);
}

/**
 * 获取月份的结束日期
 * @param {any} date - 日期
 * @returns {any} 月份结束日期
 */
export function getEndOfMonth(date) {
  const config = getGenerateConfig();
  return config.getEndOfMonth(date);
}

/**
 * 增加天数
 * @param {any} date - 日期
 * @param {number} days - 天数
 * @returns {any} 新日期
 */
export function addDays(date, days) {
  const config = getGenerateConfig();
  return config.addDate(date, days);
}

/**
 * 增加月份
 * @param {any} date - 日期
 * @param {number} months - 月份数
 * @returns {any} 新日期
 */
export function addMonths(date, months) {
  const config = getGenerateConfig();
  return config.addMonth(date, months);
}

/**
 * 增加年份
 * @param {any} date - 日期
 * @param {number} years - 年份数
 * @returns {any} 新日期
 */
export function addYears(date, years) {
  const config = getGenerateConfig();
  return config.addYear(date, years);
}
