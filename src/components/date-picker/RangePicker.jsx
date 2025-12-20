import * as moment from 'moment';
import RangeCalendar from '../vc-calendar/src/RangeCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import interopDefault from '../_util/interopDefault';
import { RangePickerProps } from './interface';
import {
  hasProp,
  getOptionProps,
  initDefaultProps,
  mergeProps,
  getComponentFromProp,
  getListeners,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { formatDate, getGenerateConfig, isDateType } from './utils';
import InputIcon from './InputIcon';
import PresetPanel from './PresetPanel';
import { getStatusClassNames } from './statusUtils';

function noop() {}
function getShowDateFromValue(value, mode) {
  const [start, end] = value;
  // value could be an empty array, then we should not reset showDate
  if (!start && !end) {
    return;
  }
  if (mode && mode[0] === 'month') {
    return [start, end];
  }
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end;
  return [start, newEnd];
}

function pickerValueAdapter(value) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value.clone().add(1, 'month')];
}

function isEmptyArray(arr) {
  if (Array.isArray(arr)) {
    return arr.length === 0 || arr.every(i => !i);
  }
  return false;
}

function fixLocale(value, localeCode) {
  if (!localeCode) {
    return;
  }
  if (!value || value.length === 0) {
    return;
  }
  const [start, end] = value;
  if (start) {
    start.locale(localeCode);
  }
  if (end) {
    end.locale(localeCode);
  }
}

export default {
  name: 'ARangePicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(RangePickerProps(), {
    allowClear: true,
    showToday: false,
    separator: '~',
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const value = this.value || this.defaultValue || [];
    const [start, end] = value;
    if (
      (start && !interopDefault(moment).isMoment(start)) ||
      (end && !interopDefault(moment).isMoment(end))
    ) {
      throw new Error(
        'The value/defaultValue of RangePicker must be a moment object array after `antd@2.0`, ' +
          'see: https://u.ant.design/date-picker-value',
      );
    }
    const pickerValue = !value || isEmptyArray(value) ? this.defaultPickerValue : value;

    // 根据 picker prop 初始化模式
    const pickerMode = this.picker || 'date';
    const initialMode = this.mode || [pickerMode, pickerMode];

    return {
      sValue: value,
      sShowDate: pickerValueAdapter(pickerValue || interopDefault(moment)()),
      sOpen: this.open,
      sHoverValue: [],
      // 新增：Active Bar 状态，追踪当前激活的输入框
      sActiveInput: 'start', // 'start' | 'end'
      // 新增：记录当前面板会话中哪些输入框已被"访问"过
      // 用于判断重新选择时是否应该关闭面板
      sOpenRecords: {}, // { start: true, end: true }
      // 新增：内部 mode 状态，用于 picker prop 控制
      sMode: initialMode,
    };
  },
  watch: {
    value(val) {
      const value = val || [];
      let state = { sValue: value };
      if (!shallowequal(val, this.sValue)) {
        // 在 picker 模式下（年份/月份/周），不更新 sShowDate
        // 因为 getShowDateFromValue 会将 null 值转换为接近另一个值的日期
        // 这会导致面板显示值被错误地重置，造成面板跳动
        const { picker } = this;
        if (!picker || picker === 'date') {
          state = {
            ...state,
            sShowDate: getShowDateFromValue(value, this.mode) || this.sShowDate,
          };
        }
      }
      this.setState(state);
    },
    open(val) {
      const state = { sOpen: val };
      this.setState(state);
    },
    sOpen(val, oldVal) {
      this.$nextTick(() => {
        if (!hasProp(this, 'open') && oldVal && !val) {
          this.focus();
        }
      });
    },
    // 监听 picker 变化，更新内部 mode
    picker(val) {
      const pickerMode = val || 'date';
      this.setState({ sMode: [pickerMode, pickerMode] });
    },
    // 监听外部 mode 变化
    mode(val) {
      if (val) {
        this.setState({ sMode: val });
      }
    },
  },
  methods: {
    /**
     * 合并 ranges 和 presets，优先使用 presets
     * 保持向后兼容，同时支持新的 presets API
     */
    getMergedPresets() {
      const { presets, ranges } = this;

      // 优先使用新的 presets API
      if (presets && presets.length > 0) {
        return presets;
      }

      // 兼容旧的 ranges API，转换为 presets 格式
      if (ranges && typeof ranges === 'object') {
        return Object.keys(ranges).map(key => ({
          label: key,
          value: ranges[key],
        }));
      }

      return [];
    },

    /**
     * 处理预设点击
     */
    handlePresetClick(value, preset, index) {
      if (typeof value === 'function') {
        value = value();
      }
      this.setValue(value, true);
      this.$emit('ok', value);
      this.$emit('openChange', false);
    },

    /**
     * 处理预设悬停
     */
    handlePresetHover(value, preset, index) {
      if (value) {
        this.setState({ sHoverValue: value });
      } else {
        this.clearHoverValue();
      }
    },

    /**
     * 内部 panelChange 处理
     * 当设置了 picker prop 时，保持模式固定，不允许切换到其他模式
     * 并且将年份/月份选择作为最终值选择处理
     */
    handleInternalPanelChange(value, mode, info) {
      const { picker, sActiveInput, sValue: prevValue, sOpenRecords } = this;
      const listeners = getListeners(this);
      const { panelChange = noop } = listeners;

      // 如果设置了 picker（非 date），将年份/月份选择作为值选择处理
      if (picker && picker !== 'date' && value) {
        const [panelStartValue, panelEndValue] = value;

        // 从 info 中获取面板来源信息
        // 这比通过值比较来判断更可靠，因为 sShowDate 可能与 sValue 不同步
        const panelSource = info && info.source; // 'start' 或 'end'

        // 检测是开始还是结束面板发生了选择
        let selectedValue = null;
        let selectedInput = sActiveInput;

        // 使用面板来源来确定用户点击的是哪个面板
        if (panelSource === 'start') {
          // 用户点击了左侧面板
          selectedValue = panelStartValue;
          selectedInput = sActiveInput; // 保持当前激活的输入框
        } else if (panelSource === 'end') {
          // 用户点击了右侧面板
          selectedValue = panelEndValue;
          selectedInput = sActiveInput; // 保持当前激活的输入框
        } else {
          // 兼容：如果没有 source 信息，回退到值比较逻辑
          const [prevStart, prevEnd] = prevValue || [];
          const startChanged =
            panelStartValue && (!prevStart || !prevStart.isSame(panelStartValue, picker));
          const endChanged = panelEndValue && (!prevEnd || !prevEnd.isSame(panelEndValue, picker));

          if (sActiveInput === 'start') {
            if (endChanged) {
              selectedValue = panelEndValue;
            } else if (startChanged) {
              selectedValue = panelStartValue;
            }
          } else if (sActiveInput === 'end') {
            if (startChanged) {
              selectedValue = panelStartValue;
            } else if (endChanged) {
              selectedValue = panelEndValue;
            }
          }
        }

        // 如果检测到选择，更新值
        if (selectedValue) {
          let newValue = [...(prevValue || [null, null])];

          // 根据 picker 类型规范化日期
          // 开始日期默认为该时间段的起始（如年份的1月1日）
          // 结束日期默认为该时间段的结束（如年份的12月31日）
          const normalizeDate = (date, isStart) => {
            if (!date) return date;
            const cloned = date.clone();
            // 对于 year/month/week，规范化到起始或结束
            if (picker === 'year' || picker === 'month' || picker === 'week') {
              return isStart ? cloned.startOf(picker) : cloned.endOf(picker);
            }
            return cloned;
          };

          if (selectedInput === 'start') {
            newValue[0] = normalizeDate(selectedValue, true);
            // 如果结束日期在开始日期之前，清空结束日期
            if (newValue[1] && selectedValue.isAfter(newValue[1], picker)) {
              newValue[1] = null;
            }
          } else {
            newValue[1] = normalizeDate(selectedValue, false);
            // 如果开始日期在结束日期之后，清空开始日期
            if (newValue[0] && selectedValue.isBefore(newValue[0], picker)) {
              newValue[0] = null;
            }
          }

          // 计算新的 sShowDate
          // 在年份/月份选择器模式下，需要更新 sShowDate 以确保：
          // 1. 重新打开面板时显示选中的值
          // 2. 从"错误的"面板选择时自动调整面板位置
          const calculateNewShowDate = () => {
            const currentShowDate = this.sShowDate || [];
            let newShowDate = [...currentShowDate];

            if (picker === 'year') {
              // 年份选择器：确保选中的值显示在正确的面板位置
              // 左面板应该显示开始年份所在的十年范围
              // 右面板应该显示结束年份所在的十年范围（且必须在左面板之后）
              if (selectedInput === 'start') {
                // 选择了开始时间，更新左面板位置
                newShowDate[0] = selectedValue.clone();
                // 确保右面板在不同的十年范围
                const startDecade = Math.floor(selectedValue.year() / 10);
                if (newShowDate[1]) {
                  const endDecade = Math.floor(newShowDate[1].year() / 10);
                  if (endDecade <= startDecade) {
                    newShowDate[1] = selectedValue.clone().year((startDecade + 1) * 10);
                  }
                } else {
                  newShowDate[1] = selectedValue.clone().year((startDecade + 1) * 10);
                }
              } else {
                // 选择了结束时间，更新右面板位置
                newShowDate[1] = selectedValue.clone();
                // 确保左面板在不同的十年范围
                const endDecade = Math.floor(selectedValue.year() / 10);
                if (newShowDate[0]) {
                  const startDecade = Math.floor(newShowDate[0].year() / 10);
                  if (startDecade >= endDecade) {
                    newShowDate[0] = selectedValue.clone().year((endDecade - 1) * 10);
                  }
                } else {
                  newShowDate[0] = selectedValue.clone().year((endDecade - 1) * 10);
                }
              }
            } else if (picker === 'month') {
              // 月份选择器：确保选中的值显示在正确的面板位置
              // 左面板应该显示开始月份所在的年份
              // 右面板应该显示结束月份所在的年份（且必须在左面板之后）
              if (selectedInput === 'start') {
                // 选择了开始时间，更新左面板位置
                newShowDate[0] = selectedValue.clone();
                // 确保右面板在不同的年份
                const startYear = selectedValue.year();
                if (newShowDate[1]) {
                  const endYear = newShowDate[1].year();
                  if (endYear <= startYear) {
                    newShowDate[1] = selectedValue.clone().year(startYear + 1);
                  }
                } else {
                  newShowDate[1] = selectedValue.clone().year(startYear + 1);
                }
              } else {
                // 选择了结束时间，更新右面板位置
                newShowDate[1] = selectedValue.clone();
                // 确保左面板在不同的年份
                const endYear = selectedValue.year();
                if (newShowDate[0]) {
                  const startYear = newShowDate[0].year();
                  if (startYear >= endYear) {
                    newShowDate[0] = selectedValue.clone().year(endYear - 1);
                  }
                } else {
                  newShowDate[0] = selectedValue.clone().year(endYear - 1);
                }
              }
            }

            return newShowDate;
          };

          const newShowDate = calculateNewShowDate();

          // 更新值和 sShowDate
          if (!hasProp(this, 'value')) {
            this.setState({ sValue: newValue, sShowDate: newShowDate });
          } else {
            // 即使 value 是受控的，也要更新 sShowDate
            this.setState({ sShowDate: newShowDate });
          }

          // 触发 change 事件
          const [start, end] = newValue;
          this.$emit('change', newValue, [
            formatDate(start, this.format),
            formatDate(end, this.format),
          ]);

          // 更新 openRecords
          const updatedOpenRecords = { ...sOpenRecords, [selectedInput]: true };

          // 智能切换到另一个输入框或关闭面板
          const nextInput = selectedInput === 'start' ? 'end' : 'start';
          const nextValue = nextInput === 'start' ? newValue[0] : newValue[1];
          const notVisited = !updatedOpenRecords[nextInput];
          const noValue = !nextValue;

          if (notVisited || noValue) {
            // 切换到另一个输入框
            const newOpenRecords = { ...updatedOpenRecords, [nextInput]: true };
            this.setState({
              sActiveInput: nextInput,
              sOpenRecords: newOpenRecords,
            });
          } else if (newValue[0] && newValue[1]) {
            // 两个值都选完了，关闭面板
            this.$nextTick(() => {
              if (!hasProp(this, 'open')) {
                this.setState({ sOpen: false, sOpenRecords: {} });
              }
              this.$emit('openChange', false);
            });
          }
        }

        // 保持模式固定
        const newMode = [picker, picker];
        this.setState({ sMode: newMode });
        panelChange(value, newMode);
        return;
      }

      // 没有设置 picker 或 picker='date'，正常处理
      let newMode = mode;
      if (picker && picker !== 'date') {
        newMode = [picker, picker];
      }
      this.setState({ sMode: newMode || mode });
      panelChange(value, newMode || mode);
    },

    setValue(value, hidePanel) {
      this.handleChange(value);
      if ((hidePanel || !this.showTime) && !hasProp(this, 'open')) {
        this.setState({ sOpen: false });
      }
    },
    clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ sValue: [] });
      this.handleChange([]);
    },

    clearHoverValue() {
      this.setState({ sHoverValue: [] });
    },

    handleChange(value) {
      const { sActiveInput, sValue: prevValue, sOpenRecords } = this;

      // 保存当前的 sActiveInput，供 handleCalendarSelect 使用
      // 因为 handleChange 会先执行并修改 sActiveInput，
      // 导致 handleCalendarSelect 无法正确判断用户实际选择的是哪个输入框
      this._lastSelectedInput = sActiveInput;

      const [prevStart, prevEnd] = prevValue || [];
      let [newStart, newEnd] = value || [];

      // 当两个日期都已存在时重新选择，清空另一个日期
      // 这样用户可以重新选择完整的日期范围，并确保面板保持打开
      // main 版本的行为：重新选择时清空另一个，让用户重新选择完整范围
      // 重要：必须检查值是否真的改变了，避免 Vue 响应式更新导致的重复调用错误触发此逻辑
      if (prevStart && prevEnd) {
        // 检查是否是真正的重新选择（新值与旧值不同）
        const startChanged = newStart && !prevStart.isSame(newStart, 'day');
        const endChanged = newEnd && !prevEnd.isSame(newEnd, 'day');

        if (sActiveInput === 'start' && newStart && startChanged) {
          // 重新选择开始日期，清空结束日期
          newEnd = null;
          value = [newStart, null];
        } else if (sActiveInput === 'end' && newEnd && endChanged) {
          // 重新选择结束日期，清空开始日期
          newStart = null;
          value = [null, newEnd];
        }
      }

      // 处理日期顺序问题：当选择的日期导致开始>结束时，清空另一个日期
      // 注意：由于上面的逻辑已经清空了另一个日期，这里主要处理首次选择时的顺序冲突
      if (newStart && newEnd && newStart.isAfter(newEnd, 'day')) {
        if (sActiveInput === 'start') {
          // 选择开始日期导致冲突，清空结束日期
          newEnd = null;
          value = [newStart, null];
        } else {
          // 选择结束日期导致冲突，清空开始日期
          newStart = null;
          value = [null, newEnd];
        }
      }

      if (!hasProp(this, 'value')) {
        // 年份/月份选择器模式下，不更新 sShowDate
        // 因为 getShowDateFromValue 会将 null 值转换为接近另一个值的日期
        // 这会导致面板显示值被错误地重置
        const { picker } = this;
        if (picker && picker !== 'date') {
          this.setState({ sValue: value });
        } else {
          this.setState(({ sShowDate }) => ({
            sValue: value,
            sShowDate: getShowDateFromValue(value) || sShowDate,
          }));
        }
      }

      // 智能切换 active input（不更新 sOpenRecords，由 handleCalendarSelect 处理）
      // 如果当前选择的是开始日期，自动切换到结束日期
      if (sActiveInput === 'start' && newStart && !newEnd) {
        this.setState({ sActiveInput: 'end' });
      }
      // 如果当前选择的是结束日期，自动切换到开始日期
      else if (sActiveInput === 'end' && newEnd && !newStart) {
        this.setState({ sActiveInput: 'start' });
      }
      // 如果两个都选择了，根据哪个改变了来决定
      else if (newStart && newEnd) {
        // 如果开始日期变了，切换到结束
        if (prevStart && !prevStart.isSame(newStart, 'day')) {
          this.setState({ sActiveInput: 'end' });
        }
        // 如果结束日期变了，切换到开始
        else if (prevEnd && !prevEnd.isSame(newEnd, 'day')) {
          this.setState({ sActiveInput: 'start' });
        }
      }

      const [start, end] = value;
      this.$emit('change', value, [formatDate(start, this.format), formatDate(end, this.format)]);
    },

    /**
     * 处理日历选择事件，控制面板关闭逻辑
     * main 版本的行为：
     * - 使用 openRecords 跟踪当前面板会话中哪些输入框已被"访问"
     * - 只有当两个输入框都被访问过且都有值时才关闭面板
     * - 否则切换到另一个输入框
     */
    handleCalendarSelect(value) {
      const [start, end] = value || [];
      const { sOpenRecords } = this;

      // 使用 handleChange 保存的 _lastSelectedInput，而不是通过值比较来判断
      // 因为 handleChange 在 handleCalendarSelect 之前执行，已经更新了 sValue 和 sActiveInput
      // 通过值比较无法正确判断用户实际选择的是哪个输入框
      const actualSelectedInput = this._lastSelectedInput || 'start';

      // 标记实际被选择的输入框为已访问
      const updatedOpenRecords = { ...sOpenRecords, [actualSelectedInput]: true };

      // 确定下一个应该激活的输入框
      const nextInput = actualSelectedInput === 'start' ? 'end' : 'start';
      const nextValue = nextInput === 'start' ? start : end;

      // 判断是否应该切换到另一个输入框
      // 条件：另一个输入框在本次会话中未被访问过，或者另一个输入框的值为空
      const notVisited = !updatedOpenRecords[nextInput];
      const noValue = !nextValue;
      const shouldSwitchToNext = notVisited || noValue;

      if (shouldSwitchToNext && (start || end)) {
        // 切换到另一个输入框，同时记录下一个输入框也已访问
        const newOpenRecords = { ...updatedOpenRecords, [nextInput]: true };
        this.setState({
          sActiveInput: nextInput,
          sOpenRecords: newOpenRecords,
        });
        // 保持面板打开
      } else if (start && end) {
        // 两个日期都选完了，且两个输入框都被访问过，关闭面板
        // 同时重置 openRecords，为下次打开做准备
        this.setState({ sOpen: false, sOpenRecords: {} });
      }
    },

    handleOpenChange(open) {
      if (!hasProp(this, 'open')) {
        this.setState({ sOpen: open });
      }

      if (open === false) {
        this.clearHoverValue();
        // 面板关闭时，重置 openRecords，为下次打开做准备
        this.setState({ sOpenRecords: {} });
      }
      this.$emit('openChange', open);
    },

    handleShowDateChange(showDate) {
      this.setState({ sShowDate: showDate });
    },

    handleHoverChange(hoverValue) {
      this.setState({ sHoverValue: hoverValue });
    },

    handleRangeMouseLeave() {
      if (this.sOpen) {
        this.clearHoverValue();
      }
    },

    handleCalendarInputSelect(value) {
      const [start] = value;
      if (!start) {
        return;
      }
      this.setState(({ sShowDate }) => ({
        sValue: value,
        sShowDate: getShowDateFromValue(value) || sShowDate,
      }));
    },

    onMouseEnter(e) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave(e) {
      this.$emit('mouseleave', e);
    },

    focus() {
      this.$refs.picker.focus();
    },

    blur() {
      this.$refs.picker.blur();
    },

    /**
     * 处理开始日期输入框焦点
     */
    handleStartInputFocus(e) {
      // 记录该输入框已被"访问"
      const newOpenRecords = { ...this.sOpenRecords, start: true };
      this.setState({ sActiveInput: 'start', sOpenRecords: newOpenRecords });
      this.$emit('focus', e);
    },

    /**
     * 处理结束日期输入框焦点
     */
    handleEndInputFocus(e) {
      // 记录该输入框已被"访问"
      const newOpenRecords = { ...this.sOpenRecords, end: true };
      this.setState({ sActiveInput: 'end', sOpenRecords: newOpenRecords });
      this.$emit('focus', e);
    },

    /**
     * 处理输入框点击，切换到对应的输入框
     */
    handleInputClick(type, e) {
      e.stopPropagation();
      // 记录该输入框已被"访问"
      const newOpenRecords = { ...this.sOpenRecords, [type]: true };
      this.setState({ sActiveInput: type, sOpenRecords: newOpenRecords });
      // 如果 picker 未打开，则打开它
      if (!this.sOpen) {
        this.handleOpenChange(true);
      }
    },

    /**
     * 获取当前选择类型，用于控制 RangeCalendar 的选择行为
     * 支持先选择结束时间的交互
     */
    getSelectionType() {
      const { sActiveInput, sValue } = this;
      const [startValue, endValue] = sValue || [];

      // 如果两个日期都已选择，根据当前激活的输入框决定修改哪个
      if (startValue && endValue) {
        return sActiveInput === 'end' ? 'end' : 'start';
      }

      // 如果只选择了开始日期
      // 尊重用户当前激活的输入框选择
      if (startValue && !endValue) {
        // 如果用户明确点击了结束日期输入框，使用 end 模式
        if (sActiveInput === 'end') {
          return 'end';
        }
        // 否则使用 both 模式，让 RangeCalendar 自动处理
        return 'both';
      }

      // 如果只选择了结束日期
      // 尊重用户当前激活的输入框选择
      if (!startValue && endValue) {
        // 如果用户明确点击了结束日期输入框，使用 end 模式（允许重新选择结束日期）
        if (sActiveInput === 'end') {
          return 'end';
        }
        // 否则使用 start 模式让 RangeCalendar 保留已选的结束日期
        return 'start';
      }

      // 如果都没选择，使用 both 模式（默认行为）
      // 但如果用户明确点击了结束日期输入框，使用 end 模式
      if (sActiveInput === 'end') {
        return 'end';
      }

      return 'both';
    },

    /**
     * 获取合并后的禁用日期函数
     * 实现与 main 版本一致的交互：
     * - 选择开始日期时，如果结束日期已选，禁用结束日期之后的日期
     * - 选择结束日期时，如果开始日期已选，禁用开始日期之前的日期
     */
    getMergedDisabledDate(disabledDate) {
      const { sActiveInput, sValue } = this;
      const [startValue, endValue] = sValue || [];

      return date => {
        // 首先检查原始的 disabledDate
        if (disabledDate && disabledDate(date)) {
          return true;
        }

        // 选择开始日期时，如果结束日期已选，禁用结束日期之后的日期
        if (sActiveInput === 'start' && endValue) {
          // 允许选择与结束日期相同的日期
          if (!date.isSame(endValue, 'day') && date.isAfter(endValue, 'day')) {
            return true;
          }
        }

        // 选择结束日期时，如果开始日期已选，禁用开始日期之前的日期
        if (sActiveInput === 'end' && startValue) {
          // 允许选择与开始日期相同的日期
          if (!date.isSame(startValue, 'day') && date.isBefore(startValue, 'day')) {
            return true;
          }
        }

        return false;
      };
    },

    renderFooter() {
      const { $scopedSlots, $slots } = this;
      const { _prefixCls: prefixCls } = this;
      const renderExtraFooter =
        this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;

      const mergedPresets = this.getMergedPresets();

      // 自定义 footer
      const customFooter = renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`} key="extra">
          {typeof renderExtraFooter === 'function' ? renderExtraFooter() : renderExtraFooter}
        </div>
      ) : null;

      // 预设面板（使用新的 PresetPanel 组件）
      const presetPanel =
        mergedPresets.length > 0 ? (
          <PresetPanel
            key="presets"
            prefixCls={prefixCls}
            presets={mergedPresets}
            onSelect={this.handlePresetClick}
            onHover={this.handlePresetHover}
          />
        ) : null;

      if (!presetPanel && !customFooter) {
        return null;
      }

      return [presetPanel, customFooter];
    },
  },

  render() {
    const props = getOptionProps(this);
    let suffixIcon = getComponentFromProp(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    const {
      sValue: value,
      sShowDate: showDate,
      sHoverValue: hoverValue,
      sOpen: open,
      $scopedSlots,
    } = this;
    const listeners = getListeners(this);
    const {
      calendarChange = noop,
      ok = noop,
      focus = noop,
      blur = noop,
      panelChange = noop,
    } = listeners;
    const {
      prefixCls: customizePrefixCls,
      tagPrefixCls: customizeTagPrefixCls,
      popupStyle,
      disabledDate,
      disabledTime,
      showTime,
      showToday,
      ranges,
      presets,
      locale,
      localeCode,
      format,
      separator,
      inputReadOnly,
      status,
      bordered,
      placement,
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);
    const tagPrefixCls = getPrefixCls('tag', customizeTagPrefixCls);
    this._prefixCls = prefixCls;
    this._tagPrefixCls = tagPrefixCls;

    const dateRender = props.dateRender || $scopedSlots.dateRender;
    fixLocale(value, localeCode);
    fixLocale(showDate, localeCode);

    const mergedPresets = this.getMergedPresets();
    const hasPresets = mergedPresets.length > 0;

    const calendarClassName = classNames({
      [`${prefixCls}-time`]: showTime,
      [`${prefixCls}-range-with-ranges`]: hasPresets,
      [`${prefixCls}-range-with-presets`]: hasPresets,
    });

    // 需要选择时间时，点击 ok 时才触发 onChange
    const pickerChangeHandler = {
      on: {
        change: this.handleChange,
      },
    };
    let calendarProps = {
      on: {
        ok: this.handleChange,
      },
      props: {},
    };
    if (props.timePicker) {
      pickerChangeHandler.on.change = changedValue => this.handleChange(changedValue);
    } else {
      calendarProps = { on: {}, props: {} };
    }
    // 使用内部 sMode 状态，支持 picker prop 控制
    // 当设置了 picker prop 时，sMode 会保持固定模式
    if (this.sMode) {
      calendarProps.props.mode = this.sMode;
    } else if ('mode' in props) {
      calendarProps.props.mode = props.mode;
    }

    const startPlaceholder = Array.isArray(props.placeholder)
      ? props.placeholder[0]
      : locale.lang.rangePlaceholder[0];
    const endPlaceholder = Array.isArray(props.placeholder)
      ? props.placeholder[1]
      : locale.lang.rangePlaceholder[1];

    // 获取合并后的禁用日期函数，实现选择时的日期限制
    const mergedDisabledDate = this.getMergedDisabledDate(disabledDate);

    const rangeCalendarProps = mergeProps(calendarProps, {
      props: {
        separator,
        format,
        prefixCls,
        renderFooter: this.renderFooter,
        timePicker: props.timePicker,
        disabledDate: mergedDisabledDate,
        disabledTime,
        dateInputPlaceholder: [startPlaceholder, endPlaceholder],
        locale: locale.lang,
        dateRender,
        value: showDate,
        hoverValue,
        showToday,
        inputReadOnly,
        // 传递当前激活的输入类型，支持先选结束时间
        type: this.getSelectionType(),
        // 传递选中的值，用于显示选中状态
        selectedValue: value,
      },
      on: {
        change: this.handleChange,
        ok,
        valueChange: this.handleShowDateChange,
        hoverChange: this.handleHoverChange,
        // 使用内部 panelChange 处理，支持 picker prop 模式锁定
        panelChange: this.handleInternalPanelChange,
        inputSelect: this.handleCalendarInputSelect,
        // 添加 select 事件处理，控制面板关闭
        select: this.handleCalendarSelect,
      },
      class: calendarClassName,
      scopedSlots: $scopedSlots,
    });
    const calendar = <RangeCalendar {...rangeCalendarProps} />;

    // default width for showTime
    const pickerStyle = {};
    if (props.showTime) {
      pickerStyle.width = '350px';
    }
    const [startValue, endValue] = value;
    const clearIcon =
      !props.disabled && props.allowClear && value && (startValue || endValue) ? (
        <Icon
          type="close-circle"
          class={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
          theme="filled"
        />
      ) : null;

    const inputIcon = <InputIcon suffixIcon={suffixIcon} prefixCls={prefixCls} />;

    const input = ({ value: inputValue }) => {
      const [start, end] = inputValue;
      const { sActiveInput, sOpen } = this;
      // Active bar 只在面板打开时显示
      const activeBarStyle = {
        left: sActiveInput === 'start' ? '0' : '50%',
        width: '50%',
        opacity: sOpen ? 1 : 0,
      };
      // 输入框高亮也只在面板打开时显示
      const isStartActive = sOpen && sActiveInput === 'start';
      const isEndActive = sOpen && sActiveInput === 'end';
      return (
        <span class={`${props.pickerInputClass} ${prefixCls}-range-picker-input-wrapper`}>
          <input
            disabled={props.disabled}
            readOnly
            value={formatDate(start, props.format)}
            placeholder={startPlaceholder}
            class={classNames(`${prefixCls}-range-picker-input`, {
              [`${prefixCls}-range-picker-input-active`]: isStartActive,
            })}
            tabIndex={-1}
            onClick={e => this.handleInputClick('start', e)}
            onFocus={this.handleStartInputFocus}
          />
          <span class={`${prefixCls}-range-picker-separator`}> {separator} </span>
          <input
            disabled={props.disabled}
            readOnly
            value={formatDate(end, props.format)}
            placeholder={endPlaceholder}
            class={classNames(`${prefixCls}-range-picker-input`, {
              [`${prefixCls}-range-picker-input-active`]: isEndActive,
            })}
            tabIndex={-1}
            onClick={e => this.handleInputClick('end', e)}
            onFocus={this.handleEndInputFocus}
          />
          {clearIcon}
          {inputIcon}
          <span class={`${prefixCls}-range-picker-active-bar`} style={activeBarStyle} />
        </span>
      );
    };
    const vcDatePickerProps = mergeProps(
      {
        props,
        on: listeners,
      },
      pickerChangeHandler,
      {
        props: {
          calendar,
          value,
          open,
          prefixCls: `${prefixCls}-picker-container`,
          placement: placement || 'bottomLeft',
        },
        on: {
          openChange: this.handleOpenChange,
        },
        style: popupStyle,
        scopedSlots: { default: input, ...$scopedSlots },
      },
    );
    // 合并 picker 类名，包含 status 状态类名
    const pickerClassName = classNames(
      props.pickerClass,
      {
        [`${prefixCls}-picker-borderless`]: bordered === false,
      },
      getStatusClassNames(`${prefixCls}-picker`, status, false),
    );

    return (
      <span
        ref="picker"
        class={pickerClassName}
        style={pickerStyle}
        tabIndex={props.disabled ? -1 : 0}
        onFocus={focus}
        onBlur={blur}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        <VcDatePicker {...vcDatePickerProps} />
      </span>
    );
  },
};
