/**
 * PresetPanel - 预设日期范围面板组件
 * 用于显示快捷选择的预设日期范围
 * 支持两种显示模式：panel（左侧面板）和 footer（底部按钮）
 */

import PropTypes from '../_util/vue-types';
import classNames from 'classnames';

export default {
  name: 'PresetPanel',
  props: {
    /**
     * 样式前缀
     */
    prefixCls: PropTypes.string,

    /**
     * 预设列表
     * @type {Array<{label: string|VNode, value: Array|Function}>}
     */
    presets: PropTypes.array.def([]),

    /**
     * 选中的预设索引
     */
    selectedIndex: PropTypes.number.def(-1),

    /**
     * 显示模式
     * - panel: 左侧面板模式（垂直列表）
     * - footer: 底部模式（水平按钮）
     */
    mode: PropTypes.oneOf(['panel', 'footer']).def('footer'),
  },

  methods: {
    /**
     * 获取预设的实际值
     * @param {Object} preset - 预设项
     * @returns {Array} 日期范围值
     */
    getPresetValue(preset) {
      if (!preset) return null;
      const { value } = preset;
      return typeof value === 'function' ? value() : value;
    },

    /**
     * 点击预设项
     * @param {Object} preset - 预设项
     * @param {number} index - 索引
     */
    handleClick(preset, index) {
      const value = this.getPresetValue(preset);
      this.$emit('select', value, preset, index);
    },

    /**
     * 鼠标进入预设项
     * @param {Object} preset - 预设项
     * @param {number} index - 索引
     */
    handleMouseEnter(preset, index) {
      const value = this.getPresetValue(preset);
      this.$emit('hover', value, preset, index);
    },

    /**
     * 鼠标离开预设项
     */
    handleMouseLeave() {
      this.$emit('hover', null, null, -1);
    },

    /**
     * 渲染底部按钮模式
     */
    renderFooterMode() {
      const { prefixCls, presets, selectedIndex } = this;
      const footerCls = `${prefixCls}-presets-footer`;

      return (
        <div class={footerCls}>
          {presets.map((preset, index) => {
            const btnCls = classNames(`${footerCls}-btn`, {
              [`${footerCls}-btn-selected`]: index === selectedIndex,
            });

            return (
              <span
                key={index}
                class={btnCls}
                onClick={() => this.handleClick(preset, index)}
                onMouseenter={() => this.handleMouseEnter(preset, index)}
                onMouseleave={this.handleMouseLeave}
              >
                {preset.label}
              </span>
            );
          })}
        </div>
      );
    },

    /**
     * 渲染左侧面板模式
     */
    renderPanelMode() {
      const { prefixCls, presets, selectedIndex } = this;
      const panelCls = `${prefixCls}-presets`;

      return (
        <div class={panelCls}>
          <ul class={`${panelCls}-list`}>
            {presets.map((preset, index) => {
              const itemCls = classNames(`${panelCls}-item`, {
                [`${panelCls}-item-selected`]: index === selectedIndex,
              });

              return (
                <li
                  key={index}
                  class={itemCls}
                  onClick={() => this.handleClick(preset, index)}
                  onMouseenter={() => this.handleMouseEnter(preset, index)}
                  onMouseleave={this.handleMouseLeave}
                >
                  {preset.label}
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
  },

  render() {
    const { presets, mode } = this;

    if (!presets || presets.length === 0) {
      return null;
    }

    return mode === 'footer' ? this.renderFooterMode() : this.renderPanelMode();
  },
};
