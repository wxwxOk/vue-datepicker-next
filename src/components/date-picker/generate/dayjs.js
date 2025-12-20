/**
 * Day.js 适配器
 * 实现 GenerateConfig 接口，用于与 dayjs 集成
 *
 * 注意：使用此适配器需要确保项目中已安装 dayjs 及必要的插件
 * npm install dayjs
 *
 * 必需的插件会在运行时自动加载
 */

import dayjs from 'dayjs';

// 加载必要的 dayjs 插件
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// 扩展 dayjs 功能
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(quarterOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * locale 映射表
 * dayjs 的 locale 名称可能与 moment 不同，需要映射
 */
const localeMap = {
  // 常见 locale 映射
  en_GB: 'en-gb',
  en_US: 'en',
  zh_CN: 'zh-cn',
  zh_TW: 'zh-tw',
  ja_JP: 'ja',
  ko_KR: 'ko',
  // 可根据需要添加更多映射
};

/**
 * 解析 locale 名称
 * @param {string} locale - 输入的 locale
 * @returns {string} dayjs 兼容的 locale
 */
function parseLocale(locale) {
  if (!locale) {
    return 'en';
  }
  // 检查映射表
  if (localeMap[locale]) {
    return localeMap[locale];
  }
  // 将下划线转为短横线
  return locale.replace(/_/g, '-').toLowerCase();
}

/**
 * 转换为 dayjs 实例
 * @param {any} value - 输入值
 * @param {string} [format] - 格式字符串
 * @returns {dayjs.Dayjs} dayjs 实例
 */
function toDayjs(value, format) {
  if (dayjs.isDayjs(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return dayjs();
  }
  if (format) {
    return dayjs(value, format);
  }
  return dayjs(value);
}

/**
 * Day.js GenerateConfig 实现
 * @type {import('./index').GenerateConfig}
 */
const dayjsGenerateConfig = {
  // ====================== 获取信息 ======================
  getNow() {
    return dayjs();
  },

  getYear(date) {
    return toDayjs(date).year();
  },

  getMonth(date) {
    return toDayjs(date).month();
  },

  getDate(date) {
    return toDayjs(date).date();
  },

  getHour(date) {
    return toDayjs(date).hour();
  },

  getMinute(date) {
    return toDayjs(date).minute();
  },

  getSecond(date) {
    return toDayjs(date).second();
  },

  getWeekDay(date) {
    return toDayjs(date).day();
  },

  getWeek(date) {
    return toDayjs(date).week();
  },

  getQuarter(date) {
    return toDayjs(date).quarter();
  },

  // ====================== 修改日期 ======================
  // dayjs 是不可变的，所有操作都返回新实例
  addYear(date, diff) {
    return toDayjs(date).add(diff, 'year');
  },

  addMonth(date, diff) {
    return toDayjs(date).add(diff, 'month');
  },

  addDate(date, diff) {
    return toDayjs(date).add(diff, 'day');
  },

  setYear(date, year) {
    return toDayjs(date).year(year);
  },

  setMonth(date, month) {
    return toDayjs(date).month(month);
  },

  setDate(date, num) {
    return toDayjs(date).date(num);
  },

  setHour(date, hour) {
    return toDayjs(date).hour(hour);
  },

  setMinute(date, minute) {
    return toDayjs(date).minute(minute);
  },

  setSecond(date, second) {
    return toDayjs(date).second(second);
  },

  // ====================== 比较 ======================
  isAfter(date1, date2) {
    return toDayjs(date1).isAfter(toDayjs(date2));
  },

  isBefore(date1, date2) {
    return toDayjs(date1).isBefore(toDayjs(date2));
  },

  isSame(date1, date2, type = 'day') {
    return toDayjs(date1).isSame(toDayjs(date2), type);
  },

  isSameYear(date1, date2) {
    return toDayjs(date1).isSame(toDayjs(date2), 'year');
  },

  isSameMonth(date1, date2) {
    return toDayjs(date1).isSame(toDayjs(date2), 'month');
  },

  isSameDate(date1, date2) {
    return toDayjs(date1).isSame(toDayjs(date2), 'day');
  },

  isSameWeek(date1, date2) {
    return toDayjs(date1).isSame(toDayjs(date2), 'week');
  },

  // ====================== 验证 ======================
  isValidate(date) {
    return toDayjs(date).isValid();
  },

  isDateType(value) {
    return dayjs.isDayjs(value);
  },

  // ====================== 转换 ======================
  toDate(value, format) {
    if (dayjs.isDayjs(value)) {
      return value;
    }
    if (value === null || value === undefined) {
      return null;
    }
    if (format) {
      return dayjs(value, format);
    }
    return dayjs(value);
  },

  toString(date, format) {
    if (!date) {
      return '';
    }
    const d = toDayjs(date);
    if (!d.isValid()) {
      return '';
    }
    if (typeof format === 'function') {
      return format(d);
    }
    return d.format(format);
  },

  clone(date) {
    // dayjs 是不可变的，直接返回
    return toDayjs(date);
  },

  // ====================== 范围操作 ======================
  getStartOfMonth(date) {
    return toDayjs(date).startOf('month');
  },

  getEndOfMonth(date) {
    return toDayjs(date).endOf('month');
  },

  getStartOfYear(date) {
    return toDayjs(date).startOf('year');
  },

  getEndOfYear(date) {
    return toDayjs(date).endOf('year');
  },

  getStartOfWeek(date) {
    return toDayjs(date).startOf('week');
  },

  getEndOfWeek(date) {
    return toDayjs(date).endOf('week');
  },

  getStartOfDay(date) {
    return toDayjs(date).startOf('day');
  },

  getEndOfDay(date) {
    return toDayjs(date).endOf('day');
  },

  // ====================== 国际化 ======================
  locale: {
    /**
     * 获取一周的第一天
     * @param {string} locale - 语言代码
     * @returns {number} 0-6 (0=Sunday)
     */
    getWeekFirstDay(locale) {
      const parsedLocale = parseLocale(locale);
      try {
        // 动态加载 locale
        require(`dayjs/locale/${parsedLocale}`);
        return dayjs()
          .locale(parsedLocale)
          .localeData()
          .firstDayOfWeek();
      } catch (e) {
        // 如果 locale 加载失败，返回默认值
        return 0;
      }
    },

    /**
     * 获取一周的第一个日期
     * @param {string} locale - 语言代码
     * @param {dayjs.Dayjs} date - 日期
     * @returns {dayjs.Dayjs} 一周的第一天
     */
    getWeekFirstDate(locale, date) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return toDayjs(date)
          .locale(parsedLocale)
          .startOf('week');
      } catch (e) {
        return toDayjs(date).startOf('week');
      }
    },

    /**
     * 获取周数
     * @param {string} locale - 语言代码
     * @param {dayjs.Dayjs} date - 日期
     * @returns {number} 周数
     */
    getWeek(locale, date) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return toDayjs(date)
          .locale(parsedLocale)
          .week();
      } catch (e) {
        return toDayjs(date).week();
      }
    },

    /**
     * 格式化日期
     * @param {string} locale - 语言代码
     * @param {dayjs.Dayjs} date - 日期
     * @param {string} format - 格式字符串
     * @returns {string} 格式化后的字符串
     */
    format(locale, date, format) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return toDayjs(date)
          .locale(parsedLocale)
          .format(format);
      } catch (e) {
        return toDayjs(date).format(format);
      }
    },

    /**
     * 解析日期字符串
     * @param {string} locale - 语言代码
     * @param {string} text - 日期字符串
     * @param {string[]} formats - 格式字符串数组
     * @returns {dayjs.Dayjs|null} 解析后的日期
     */
    parse(locale, text, formats) {
      if (!text) {
        return null;
      }
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
      } catch (e) {
        // 忽略 locale 加载错误
      }

      // 尝试每种格式
      for (let i = 0; i < formats.length; i++) {
        const format = formats[i];
        const parsed = dayjs(text, format, parsedLocale, true);
        if (parsed.isValid()) {
          return parsed;
        }
      }
      return null;
    },

    /**
     * 设置日期的 locale
     * @param {dayjs.Dayjs} date - 日期
     * @param {string} locale - 语言代码
     * @returns {dayjs.Dayjs} 设置 locale 后的日期
     */
    setLocale(date, locale) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return toDayjs(date).locale(parsedLocale);
      } catch (e) {
        return toDayjs(date);
      }
    },

    /**
     * 获取短月份名称列表
     * @param {string} locale - 语言代码
     * @returns {string[]} 月份名称数组
     */
    getShortMonths(locale) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return dayjs()
          .locale(parsedLocale)
          .localeData()
          .monthsShort();
      } catch (e) {
        return dayjs()
          .localeData()
          .monthsShort();
      }
    },

    /**
     * 获取短星期名称列表
     * @param {string} locale - 语言代码
     * @returns {string[]} 星期名称数组
     */
    getShortWeekDays(locale) {
      const parsedLocale = parseLocale(locale);
      try {
        require(`dayjs/locale/${parsedLocale}`);
        return dayjs()
          .locale(parsedLocale)
          .localeData()
          .weekdaysMin();
      } catch (e) {
        return dayjs()
          .localeData()
          .weekdaysMin();
      }
    },
  },
};

export default dayjsGenerateConfig;
