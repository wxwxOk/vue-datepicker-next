/**
 * 状态工具函数
 * 用于处理表单验证状态的类名生成
 */

/**
 * 状态类型枚举
 */
export const InputStatuses = ['success', 'warning', 'error', 'validating'];

/**
 * 获取状态相关的类名
 * @param {string} prefixCls - 样式前缀
 * @param {string} status - 状态类型
 * @param {boolean} hasFeedback - 是否有反馈图标
 * @returns {Object} 类名对象
 */
export function getStatusClassNames(prefixCls, status, hasFeedback) {
  return {
    [`${prefixCls}-status-success`]: status === 'success',
    [`${prefixCls}-status-warning`]: status === 'warning',
    [`${prefixCls}-status-error`]: status === 'error',
    [`${prefixCls}-status-validating`]: status === 'validating',
    [`${prefixCls}-has-feedback`]: hasFeedback,
  };
}

/**
 * 合并状态
 * 优先使用组件自身的 status，否则使用上下文的 status
 * @param {string} contextStatus - 上下文状态
 * @param {string} customStatus - 自定义状态
 * @returns {string} 合并后的状态
 */
export function getMergedStatus(contextStatus, customStatus) {
  return customStatus || contextStatus;
}

/**
 * 判断是否有有效状态
 * @param {string} status - 状态
 * @returns {boolean}
 */
export function hasStatus(status) {
  return InputStatuses.includes(status);
}

export default {
  InputStatuses,
  getStatusClassNames,
  getMergedStatus,
  hasStatus,
};
