/**
 * PresetPanel - 预设日期范围面板组件
 * 用于显示快捷选择的预设日期范围
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
  },

  render() {
    const { prefixCls, presets, selectedIndex } = this;

    if (!presets || presets.length === 0) {
      return null;
    }

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
};
