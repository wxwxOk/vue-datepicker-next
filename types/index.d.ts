import { VueConstructor } from 'vue';
import { Moment } from 'moment';

export interface DatePickerProps {
  value?: Moment;
  defaultValue?: Moment;
  defaultPickerValue?: Moment;
  format?: string | string[];
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  size?: 'large' | 'default' | 'small';
  suffixIcon?: any;
  locale?: object;
  showTime?: boolean | object;
  showToday?: boolean;
  open?: boolean;
  disabledDate?: (currentDate: Moment) => boolean;
  disabledTime?: (date: Moment) => object;
  getCalendarContainer?: (trigger: HTMLElement) => HTMLElement;
  inputReadOnly?: boolean;
  valueFormat?: string;
}

export interface RangePickerProps {
  value?: [Moment, Moment];
  defaultValue?: [Moment, Moment];
  defaultPickerValue?: [Moment, Moment];
  format?: string;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: [string, string];
  size?: 'large' | 'default' | 'small';
  suffixIcon?: any;
  locale?: object;
  showTime?: boolean | object;
  open?: boolean;
  disabledDate?: (currentDate: Moment) => boolean;
  disabledTime?: (dates: [Moment, Moment], partial: 'start' | 'end') => object;
  getCalendarContainer?: (trigger: HTMLElement) => HTMLElement;
  inputReadOnly?: boolean;
  valueFormat?: string;
  separator?: string;
  ranges?: object;
  // 1.7.8 新增属性
  presets?: Array<{ label: string | any; value: [Moment, Moment] | (() => [Moment, Moment]) }>;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  status?: 'error' | 'warning' | 'success' | 'validating';
  bordered?: boolean;
  allowEmpty?: [boolean, boolean];
}

export interface MonthPickerProps {
  value?: Moment;
  defaultValue?: Moment;
  defaultPickerValue?: Moment;
  format?: string;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  size?: 'large' | 'default' | 'small';
  locale?: object;
  monthCellContentRender?: (date: Moment, locale: string) => any;
}

export interface WeekPickerProps {
  value?: Moment;
  defaultValue?: Moment;
  defaultPickerValue?: Moment;
  format?: string;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  size?: 'large' | 'default' | 'small';
  locale?: object;
}

export interface DatePickerComponent extends VueConstructor {
  RangePicker: VueConstructor;
  MonthPicker: VueConstructor;
  WeekPicker: VueConstructor;
}

export const DatePicker: DatePickerComponent;
export const RangePicker: VueConstructor;
export const MonthPicker: VueConstructor;
export const WeekPicker: VueConstructor;

export interface GenerateConfig {
  getNow: () => any;
  getYear: (date: any) => number;
  getMonth: (date: any) => number;
  getDate: (date: any) => number;
  // ... 其他方法
}

export function setGenerateConfig(config: GenerateConfig): void;
export function getGenerateConfig(): GenerateConfig;

export const momentGenerateConfig: GenerateConfig;
export const dayjsGenerateConfig: GenerateConfig;

declare const _default: {
  install: (Vue: VueConstructor) => void;
  DatePicker: DatePickerComponent;
  RangePicker: VueConstructor;
  MonthPicker: VueConstructor;
  WeekPicker: VueConstructor;
};

export default _default;
