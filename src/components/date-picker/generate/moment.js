/**
 * Moment.js 适配器
 * 实现 GenerateConfig 接口，用于与 moment.js 集成
 */

import * as moment from 'moment';
import interopDefault from '../../_util/interopDefault';

const momentInstance = interopDefault(moment);

/**
 * 获取 moment 实例，处理 ES Module 兼容
 * @param {any} value - 输入值
 * @param {string} [format] - 格式字符串
 * @returns {moment.Moment} moment 实例
 */
function toMoment(value, format) {
  if (momentInstance.isMoment(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return momentInstance();
  }
  if (format) {
    return momentInstance(value, format);
  }
  return momentInstance(value);
}

/**
 * Moment.js GenerateConfig 实现
 * @type {import('./index').GenerateConfig}
 */
const momentGenerateConfig = {
  // ====================== 获取信息 ======================
  getNow() {
    return momentInstance();
  },

  getYear(date) {
    return toMoment(date).year();
  },

  getMonth(date) {
    return toMoment(date).month();
  },

  getDate(date) {
    return toMoment(date).date();
  },

  getHour(date) {
    return toMoment(date).hour();
  },

  getMinute(date) {
    return toMoment(date).minute();
  },

  getSecond(date) {
    return toMoment(date).second();
  },

  getWeekDay(date) {
    return toMoment(date).day();
  },

  getWeek(date) {
    return toMoment(date).week();
  },

  getQuarter(date) {
    return toMoment(date).quarter();
  },

  // ====================== 修改日期 ======================
  addYear(date, diff) {
    return toMoment(date)
      .clone()
      .add(diff, 'year');
  },

  addMonth(date, diff) {
    return toMoment(date)
      .clone()
      .add(diff, 'month');
  },

  addDate(date, diff) {
    return toMoment(date)
      .clone()
      .add(diff, 'day');
  },

  setYear(date, year) {
    return toMoment(date)
      .clone()
      .year(year);
  },

  setMonth(date, month) {
    // 注意: moment 的 month 是 0-11
    return toMoment(date)
      .clone()
      .month(month);
  },

  setDate(date, num) {
    return toMoment(date)
      .clone()
      .date(num);
  },

  setHour(date, hour) {
    return toMoment(date)
      .clone()
      .hour(hour);
  },

  setMinute(date, minute) {
    return toMoment(date)
      .clone()
      .minute(minute);
  },

  setSecond(date, second) {
    return toMoment(date)
      .clone()
      .second(second);
  },

  // ====================== 比较 ======================
  isAfter(date1, date2) {
    return toMoment(date1).isAfter(toMoment(date2));
  },

  isBefore(date1, date2) {
    return toMoment(date1).isBefore(toMoment(date2));
  },

  isSame(date1, date2, type = 'day') {
    return toMoment(date1).isSame(toMoment(date2), type);
  },

  isSameYear(date1, date2) {
    return toMoment(date1).isSame(toMoment(date2), 'year');
  },

  isSameMonth(date1, date2) {
    return toMoment(date1).isSame(toMoment(date2), 'month');
  },

  isSameDate(date1, date2) {
    return toMoment(date1).isSame(toMoment(date2), 'day');
  },

  isSameWeek(date1, date2) {
    return toMoment(date1).isSame(toMoment(date2), 'week');
  },

  // ====================== 验证 ======================
  isValidate(date) {
    return toMoment(date).isValid();
  },

  isDateType(value) {
    return momentInstance.isMoment(value);
  },

  // ====================== 转换 ======================
  toDate(value, format) {
    if (momentInstance.isMoment(value)) {
      return value;
    }
    if (value === null || value === undefined) {
      return null;
    }
    if (format) {
      return momentInstance(value, format);
    }
    return momentInstance(value);
  },

  toString(date, format) {
    if (!date) {
      return '';
    }
    const m = toMoment(date);
    if (!m.isValid()) {
      return '';
    }
    if (typeof format === 'function') {
      return format(m);
    }
    return m.format(format);
  },

  clone(date) {
    return toMoment(date).clone();
  },

  // ====================== 范围操作 ======================
  getStartOfMonth(date) {
    return toMoment(date)
      .clone()
      .startOf('month');
  },

  getEndOfMonth(date) {
    return toMoment(date)
      .clone()
      .endOf('month');
  },

  getStartOfYear(date) {
    return toMoment(date)
      .clone()
      .startOf('year');
  },

  getEndOfYear(date) {
    return toMoment(date)
      .clone()
      .endOf('year');
  },

  getStartOfWeek(date) {
    return toMoment(date)
      .clone()
      .startOf('week');
  },

  getEndOfWeek(date) {
    return toMoment(date)
      .clone()
      .endOf('week');
  },

  getStartOfDay(date) {
    return toMoment(date)
      .clone()
      .startOf('day');
  },

  getEndOfDay(date) {
    return toMoment(date)
      .clone()
      .endOf('day');
  },

  // ====================== 国际化 ======================
  locale: {
    /**
     * 获取一周的第一天
     * @param {string} locale - 语言代码
     * @returns {number} 0-6 (0=Sunday)
     */
    getWeekFirstDay(locale) {
      const m = locale ? momentInstance().locale(locale) : momentInstance();
      return m.localeData().firstDayOfWeek();
    },

    /**
     * 获取一周的第一个日期
     * @param {string} locale - 语言代码
     * @param {moment.Moment} date - 日期
     * @returns {moment.Moment} 一周的第一天
     */
    getWeekFirstDate(locale, date) {
      const m = toMoment(date);
      if (locale) {
        m.locale(locale);
      }
      return m.clone().startOf('week');
    },

    /**
     * 获取周数
     * @param {string} locale - 语言代码
     * @param {moment.Moment} date - 日期
     * @returns {number} 周数
     */
    getWeek(locale, date) {
      const m = toMoment(date);
      if (locale) {
        m.locale(locale);
      }
      return m.week();
    },

    /**
     * 格式化日期
     * @param {string} locale - 语言代码
     * @param {moment.Moment} date - 日期
     * @param {string} format - 格式字符串
     * @returns {string} 格式化后的字符串
     */
    format(locale, date, format) {
      const m = toMoment(date);
      if (locale) {
        m.locale(locale);
      }
      return m.format(format);
    },

    /**
     * 解析日期字符串
     * @param {string} locale - 语言代码
     * @param {string} text - 日期字符串
     * @param {string[]} formats - 格式字符串数组
     * @returns {moment.Moment|null} 解析后的日期
     */
    parse(locale, text, formats) {
      if (!text) {
        return null;
      }
      const m = momentInstance(text, formats, locale, true);
      return m.isValid() ? m : null;
    },

    /**
     * 设置日期的 locale
     * @param {moment.Moment} date - 日期
     * @param {string} locale - 语言代码
     * @returns {moment.Moment} 设置 locale 后的日期
     */
    setLocale(date, locale) {
      const m = toMoment(date);
      if (locale) {
        m.locale(locale);
      }
      return m;
    },

    /**
     * 获取短月份名称列表
     * @param {string} locale - 语言代码
     * @returns {string[]} 月份名称数组
     */
    getShortMonths(locale) {
      const m = locale ? momentInstance().locale(locale) : momentInstance();
      return m.localeData().monthsShort();
    },

    /**
     * 获取短星期名称列表
     * @param {string} locale - 语言代码
     * @returns {string[]} 星期名称数组
     */
    getShortWeekDays(locale) {
      const m = locale ? momentInstance().locale(locale) : momentInstance();
      return m.localeData().weekdaysMin();
    },
  },
};

export default momentGenerateConfig;
