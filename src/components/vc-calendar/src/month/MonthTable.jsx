import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function noop() {}

// 判断是否为范围选择模式
function isRangeMode(selectedValue) {
  return Array.isArray(selectedValue);
}

// 获取范围开始的年月
function getRangeStart(selectedValue) {
  if (!isRangeMode(selectedValue) || !selectedValue[0]) return null;
  return {
    year: selectedValue[0].year(),
    month: selectedValue[0].month(),
  };
}

// 获取范围结束的年月
function getRangeEnd(selectedValue) {
  if (!isRangeMode(selectedValue) || !selectedValue[1]) return null;
  return {
    year: selectedValue[1].year(),
    month: selectedValue[1].month(),
  };
}

// 比较两个年月
function compareYearMonth(year1, month1, year2, month2) {
  if (year1 !== year2) return year1 - year2;
  return month1 - month2;
}

const MonthTable = {
  name: 'MonthTable',
  mixins: [BaseMixin],
  props: {
    cellRender: PropTypes.func,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    // 支持单个值或数组（范围选择）
    selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    locale: PropTypes.any,
    contentRender: PropTypes.any,
    disabledDate: PropTypes.func,
  },
  data() {
    return {
      sValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
  },
  methods: {
    setAndSelectValue(value) {
      this.setState({
        sValue: value,
      });
      this.__emit('select', value);
    },
    chooseMonth(month) {
      const next = this.sValue.clone();
      next.month(month);
      this.setAndSelectValue(next);
    },
    months() {
      const value = this.sValue;
      const current = value.clone();
      const months = [];
      let index = 0;
      for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
        months[rowIndex] = [];
        for (let colIndex = 0; colIndex < COL; colIndex++) {
          current.month(index);
          const content = getMonthName(current);
          months[rowIndex][colIndex] = {
            value: index,
            content,
            title: content,
          };
          index++;
        }
      }
      return months;
    },
  },

  render() {
    const props = this.$props;
    const value = this.sValue;
    const { selectedValue } = props;
    const today = getTodayTime(value);
    const months = this.months();
    const { prefixCls, locale, contentRender, cellRender, disabledDate } = props;

    // 判断是范围模式还是单值模式
    const rangeMode = isRangeMode(selectedValue);
    const rangeStart = getRangeStart(selectedValue);
    const rangeEnd = getRangeEnd(selectedValue);

    // 单值模式：只有当 selectedValue 存在且与当前面板年份相同时，才显示选中状态
    const hasSelectedValue = !rangeMode && selectedValue && selectedValue.year() === value.year();
    const selectedMonth = hasSelectedValue ? selectedValue.month() : -1;

    // 获取根前缀类（用于 in-range-cell 类名）
    const rootPrefixCls = prefixCls.replace('-month-panel', '');
    const currentYear = value.year();

    const monthsEls = months.map((month, index) => {
      const tds = month.map(monthData => {
        let disabled = false;
        if (disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = disabledDate(testValue);
        }

        // 判断当前月份是否在范围内
        let isRangeStart = false;
        let isRangeEnd = false;
        let isInRange = false;

        if (rangeMode && rangeStart && rangeEnd) {
          // 当前月份的年月
          const currentYearMonth = { year: currentYear, month: monthData.value };

          // 判断是否为范围开始
          isRangeStart = rangeStart.year === currentYear && rangeStart.month === monthData.value;

          // 判断是否为范围结束
          isRangeEnd = rangeEnd.year === currentYear && rangeEnd.month === monthData.value;

          // 判断是否在范围中间
          const compareWithStart = compareYearMonth(
            currentYear,
            monthData.value,
            rangeStart.year,
            rangeStart.month
          );
          const compareWithEnd = compareYearMonth(
            currentYear,
            monthData.value,
            rangeEnd.year,
            rangeEnd.month
          );
          isInRange = compareWithStart > 0 && compareWithEnd < 0;
        }

        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          // 单值模式的选中状态
          [`${prefixCls}-selected-cell`]: monthData.value === selectedMonth,
          // 范围模式的选中状态
          [`${prefixCls}-selected-start-cell`]: isRangeStart,
          [`${prefixCls}-selected-end-cell`]: isRangeEnd,
          [`${rootPrefixCls}-in-range-cell`]: isInRange || isRangeStart || isRangeEnd,
          [`${prefixCls}-current-cell`]:
            today.year() === value.year() && monthData.value === today.month(),
        };
        let cellEl;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = <a class={`${prefixCls}-month`}>{content}</a>;
        }
        return (
          <td
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? noop : () => this.chooseMonth(monthData.value)}
            title={monthData.title}
            class={classNameMap}
          >
            {cellEl}
          </td>
        );
      });
      return (
        <tr key={index} role="row">
          {tds}
        </tr>
      );
    });

    return (
      <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody class={`${prefixCls}-tbody`}>{monthsEls}</tbody>
      </table>
    );
  },
};

export default MonthTable;
