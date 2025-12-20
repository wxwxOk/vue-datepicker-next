// import { TimePickerProps } from '../time-picker'
import PropTypes from '../_util/vue-types';
import { TimesType, TimeType } from '../_util/moment-util';

export const PickerProps = () => ({
  name: PropTypes.string,
  transitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  suffixIcon: PropTypes.any,
  popupStyle: PropTypes.object,
  dropdownClassName: PropTypes.string,
  locale: PropTypes.any,
  localeCode: PropTypes.string,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  getCalendarContainer: PropTypes.func,
  open: PropTypes.bool,
  // onOpenChange: PropTypes.(status: bool) => void,
  disabledDate: PropTypes.func,
  showToday: PropTypes.bool,
  dateRender: PropTypes.any, // (current: moment.Moment, today: moment.Moment) => React.ReactNode,
  pickerClass: PropTypes.string,
  pickerInputClass: PropTypes.string,
  timePicker: PropTypes.any,
  autoFocus: PropTypes.bool,
  tagPrefixCls: PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.object.def(() => ({})),
  inputReadOnly: PropTypes.bool,
  valueFormat: PropTypes.string,
});

export const SinglePickerProps = () => ({
  value: TimeType,
  defaultValue: TimeType,
  defaultPickerValue: TimeType,
  renderExtraFooter: PropTypes.any,
  placeholder: PropTypes.string,
  // onChange?: (date: moment.Moment, dateString: string) => void;
});

export const DatePickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  open: PropTypes.bool,
  disabledTime: PropTypes.func,
  // onOpenChange?: (status: bool) => void;
  // onOk?: (selectedTime: moment.Moment) => void;
  mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
});

export const MonthPickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  placeholder: PropTypes.string,
  monthCellContentRender: PropTypes.func,
});
// export const RangePickerPresetRange = PropTypes.oneOfType([TimesType, PropTypes.func])

/**
 * 预设日期项定义
 * @typedef {Object} PresetDate
 * @property {string|VNode} label - 显示标签
 * @property {Array|Function} value - 预设值或返回预设值的函数
 */

/**
 * 弹出位置类型
 * @type {Array<string>}
 */
export const DatePickerPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'];

/**
 * 状态类型
 * @type {Array<string>}
 */
export const DatePickerStatuses = ['error', 'warning', 'success', 'validating'];

/**
 * 选择器类型
 * @type {Array<string>}
 */
export const PickerModes = ['date', 'week', 'month', 'quarter', 'year'];

export const RangePickerProps = () => ({
  ...PickerProps(),
  tagPrefixCls: PropTypes.string,
  value: TimesType,
  defaultValue: TimesType,
  defaultPickerValue: TimesType,
  timePicker: PropTypes.any,
  // onChange?: (dates: TimesType, dateStrings: [string, string]) => void;
  // onCalendarChange?: (dates: TimesType, dateStrings: [string, string]) => void;
  // onOk?: (selectedTime: moment.Moment) => void;
  showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  ranges: PropTypes.object, // 保留向后兼容
  placeholder: PropTypes.arrayOf(String),
  mode: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  separator: PropTypes.any,
  disabledTime: PropTypes.func,
  showToday: PropTypes.bool,
  renderExtraFooter: PropTypes.any,
  // onPanelChange?: (value?: TimesType, mode?: string | string[]) => void;

  /**
   * 选择器类型 (参考 ant-design-vue 4.x)
   * 设置后会固定选择器模式，选择完成后直接确认，无需进一步选择日期
   * @default 'date'
   * @example picker="year" // 年份范围选择器
   * @example picker="month" // 月份范围选择器
   * @example picker="week" // 周范围选择器
   */
  picker: PropTypes.oneOf(PickerModes),

  // ============= 新增属性 (参考 ant-design-vue-main) =============

  /**
   * 预设时间范围快捷选择
   * 替代旧的 ranges 属性，提供更灵活的配置
   * @example
   * presets: [
   *   { label: '今天', value: [moment(), moment()] },
   *   { label: '本周', value: () => [moment().startOf('week'), moment().endOf('week')] }
   * ]
   */
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any, // 支持字符串或 VNode
      value: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    }),
  ),

  /**
   * 弹出位置
   * @default 'bottomLeft'
   */
  placement: PropTypes.oneOf(DatePickerPlacements),

  /**
   * 设置校验状态
   * 用于表单验证反馈
   */
  status: PropTypes.oneOf(DatePickerStatuses),

  /**
   * 是否显示边框
   * @default true
   */
  bordered: PropTypes.bool.def(true),

  /**
   * 允许起始项部分为空
   * @example allowEmpty: [true, false] // 允许起始为空，结束不能为空
   */
  allowEmpty: PropTypes.arrayOf(PropTypes.bool),
});

export const WeekPickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  placeholder: PropTypes.string,
});

// export interface DatePickerDecorator extends React.ClassicComponentClass<DatePickerProps> {
//   RangePicker: React.ClassicComponentClass<RangePickerProps>;
//   MonthPicker: React.ClassicComponentClass<MonthPickerProps>;
//   WeekPicker: React.ClassicComponentClass<WeexPickerProps>;
// }
