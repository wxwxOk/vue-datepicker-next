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
function getRangeStartYear(value) {
  if (!isRangeMode(value)) return null;
  return value[0] ? value[0].year() : null;
}

// 获取范围结束年份
function getRangeEndYear(value) {
  if (!isRangeMode(value)) return null;
  return value[1] ? value[1].year() : null;
}

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    // 支持单个值或数组（范围选择）
    selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    // hover 值，用于范围选择时的预览效果
    hoverValue: PropTypes.array.def([]),
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
    const { selectedValue, hoverValue } = $props;
    const decadePanelShow = getListeners(this).decadePanelShow || noop;
    const yearHover = getListeners(this).yearHover || noop;
    const years = this.years();
    const currentYear = value.year();

    // 判断是范围模式还是单值模式
    const rangeMode = isRangeMode(selectedValue);

    // 使用 hoverValue 进行范围预览（如果存在的话）
    const rangeValue = hoverValue && hoverValue.length ? hoverValue : selectedValue;
    const rangeStartYear = getRangeStartYear(rangeValue);
    const rangeEndYear = getRangeEndYear(rangeValue);

    // 选中值（用于显示实际选中的起始和结束）
    const selectedStartYear = getRangeStartYear(selectedValue);
    const selectedEndYear = getRangeEndYear(selectedValue);

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

        // 判断是否为选中的起始/结束（使用实际选中值，而非 hover 值）
        const isSelectedStart = rangeMode && selectedStartYear !== null && yearData.year === selectedStartYear && isInCurrentDecade;
        const isSelectedEnd = rangeMode && selectedEndYear !== null && yearData.year === selectedEndYear && isInCurrentDecade;

        // 判断是否为范围起始/结束/中间（使用 rangeValue，可能是 hover 值）
        const isRangeStart = rangeMode && rangeStartYear !== null && yearData.year === rangeStartYear && isInCurrentDecade;
        const isRangeEnd = rangeMode && rangeEndYear !== null && yearData.year === rangeEndYear && isInCurrentDecade;
        const isInRange = rangeMode &&
          rangeStartYear !== null &&
          rangeEndYear !== null &&
          yearData.year > rangeStartYear &&
          yearData.year < rangeEndYear &&
          isInCurrentDecade;

        // 判断是否为 hover 预览状态（有 hoverValue 时）
        const isHoverRange = hoverValue && hoverValue.length > 0;

        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          // 单值模式的选中状态
          [`${prefixCls}-selected-cell`]: selectedYear !== null && yearData.year === selectedYear,
          // 范围模式的选中状态（实际选中）
          [`${prefixCls}-selected-start-cell`]: isSelectedStart,
          [`${prefixCls}-selected-end-cell`]: isSelectedEnd,
          // 范围背景（包括 hover 预览）
          [`${this.rootPrefixCls}-in-range-cell`]: isInRange || isRangeStart || isRangeEnd,
          // hover 预览状态（仅当有 hoverValue 时才添加 hover 样式类）
          [`${this.rootPrefixCls}-in-hover-range-cell`]: isHoverRange && (isInRange || isRangeStart || isRangeEnd),
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

        // hover 处理函数
        const hoverHandler = () => {
          if (disabled || yearData.year < startYear || yearData.year > endYear) {
            return;
          }
          const hoverTime = value.clone().year(yearData.year);
          yearHover(hoverTime);
        };

        return (
          <td
            role="gridcell"
            title={yearData.title}
            key={yearData.content}
            onClick={disabled ? noop : clickHandler}
            onMouseenter={hoverHandler}
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
