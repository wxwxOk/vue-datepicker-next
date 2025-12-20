import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getListeners } from '../../../_util/props-util';
const ROW = 4;
const COL = 3;
function noop() {}
function goYear(direction) {
  const value = this.sValue.clone();
  value.add(direction, 'year');
  this.setState({
    sValue: value,
  });
  // 发出 valueChange 事件，让父组件可以联动处理
  this.__emit('valueChange', value);
}

function chooseYear(year) {
  const value = this.sValue.clone();
  value.year(year);
  value.month(this.sValue.month());
  this.sValue = value;
  this.__emit('select', value);
}

// 判断是否为范围选择模式
function isRangeMode(selectedValue) {
  return Array.isArray(selectedValue);
}

// 获取范围开始年份
function getRangeStartYear(selectedValue) {
  if (!isRangeMode(selectedValue)) return null;
  return selectedValue[0] ? selectedValue[0].year() : null;
}

// 获取范围结束年份
function getRangeEndYear(selectedValue) {
  if (!isRangeMode(selectedValue)) return null;
  return selectedValue[1] ? selectedValue[1].year() : null;
}

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    // 支持单个值或数组（范围选择）
    selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    locale: PropTypes.object,
    renderFooter: PropTypes.func,
    disabledDate: PropTypes.func,
  },
  data() {
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
    return {
      sValue: this.value || this.defaultValue,
    };
  },
  watch: {
    value(val) {
      this.sValue = val;
    },
  },
  methods: {
    years() {
      const value = this.sValue;
      const currentYear = value.year();
      const startYear = parseInt(currentYear / 10, 10) * 10;
      const previousYear = startYear - 1;
      const years = [];
      let index = 0;
      for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
        years[rowIndex] = [];
        for (let colIndex = 0; colIndex < COL; colIndex++) {
          const year = previousYear + index;
          const content = String(year);
          years[rowIndex][colIndex] = {
            content,
            year,
            title: content,
          };
          index++;
        }
      }
      return years;
    },
  },

  render() {
    const { sValue: value, locale, renderFooter, $props } = this;
    const { selectedValue } = $props;
    const decadePanelShow = getListeners(this).decadePanelShow || noop;
    const years = this.years();
    const currentYear = value.year();

    // 判断是范围模式还是单值模式
    const rangeMode = isRangeMode(selectedValue);
    const rangeStartYear = getRangeStartYear(selectedValue);
    const rangeEndYear = getRangeEndYear(selectedValue);

    // 单值模式：只有当 selectedValue 存在时才显示选中状态
    const selectedYear = !rangeMode && selectedValue ? selectedValue.year() : null;

    const startYear = parseInt(currentYear / 10, 10) * 10;
    const endYear = startYear + 9;
    const prefixCls = `${this.rootPrefixCls}-year-panel`;
    const { disabledDate } = $props;

    const yeasEls = years.map((row, index) => {
      const tds = row.map(yearData => {
        let disabled = false;
        if (disabledDate) {
          const testValue = value.clone();
          testValue.year(yearData.year);
          disabled = disabledDate(testValue);
        }

        // 判断年份是否在当前十年范围内（不是上一十年或下一十年的预览）
        const isInCurrentDecade = yearData.year >= startYear && yearData.year <= endYear;

        // 判断是否为范围起始/结束/中间，只在当前十年范围内应用
        const isRangeStart = rangeMode && rangeStartYear !== null && yearData.year === rangeStartYear && isInCurrentDecade;
        const isRangeEnd = rangeMode && rangeEndYear !== null && yearData.year === rangeEndYear && isInCurrentDecade;
        const isInRange = rangeMode &&
          rangeStartYear !== null &&
          rangeEndYear !== null &&
          yearData.year > rangeStartYear &&
          yearData.year < rangeEndYear &&
          isInCurrentDecade;

        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          // 单值模式的选中状态
          [`${prefixCls}-selected-cell`]: selectedYear !== null && yearData.year === selectedYear,
          // 范围模式的选中状态
          [`${prefixCls}-selected-start-cell`]: isRangeStart,
          [`${prefixCls}-selected-end-cell`]: isRangeEnd,
          [`${this.rootPrefixCls}-in-range-cell`]: isInRange || isRangeStart || isRangeEnd,
          [`${prefixCls}-last-decade-cell`]: yearData.year < startYear,
          [`${prefixCls}-next-decade-cell`]: yearData.year > endYear,
        };
        let clickHandler = noop;
        if (yearData.year < startYear) {
          clickHandler = this.previousDecade;
        } else if (yearData.year > endYear) {
          clickHandler = this.nextDecade;
        } else {
          clickHandler = chooseYear.bind(this, yearData.year);
        }
        return (
          <td
            role="gridcell"
            title={yearData.title}
            key={yearData.content}
            onClick={disabled ? noop : clickHandler}
            class={classNameMap}
          >
            <a class={`${prefixCls}-year`}>{yearData.content}</a>
          </td>
        );
      });
      return (
        <tr key={index} role="row">
          {tds}
        </tr>
      );
    });
    const footer = renderFooter && renderFooter('year');
    return (
      <div class={prefixCls}>
        <div>
          <div class={`${prefixCls}-header`}>
            <a
              class={`${prefixCls}-prev-decade-btn`}
              role="button"
              onClick={this.previousDecade}
              title={locale.previousDecade}
            />
            <a
              class={`${prefixCls}-decade-select`}
              role="button"
              onClick={decadePanelShow}
              title={locale.decadeSelect}
            >
              <span class={`${prefixCls}-decade-select-content`}>
                {startYear}-{endYear}
              </span>
              <span class={`${prefixCls}-decade-select-arrow`}>x</span>
            </a>

            <a
              class={`${prefixCls}-next-decade-btn`}
              role="button"
              onClick={this.nextDecade}
              title={locale.nextDecade}
            />
          </div>
          <div class={`${prefixCls}-body`}>
            <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
              <tbody class={`${prefixCls}-tbody`}>{yeasEls}</tbody>
            </table>
          </div>
          {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        </div>
      </div>
    );
  },
};
