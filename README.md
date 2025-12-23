# Vue DatePicker Next

[![npm version](https://img.shields.io/npm/v/@wangxinowo/vue-datepicker-next.svg)](https://www.npmjs.com/package/@wangxinowo/vue-datepicker-next)
[![license](https://img.shields.io/npm/l/@wangxinowo/vue-datepicker-next.svg)](https://github.com/wangxinowo/vue-datepicker-next/blob/main/LICENSE)

一款功能强大的 Vue 2.x 日期选择器组件，基于 Ant Design Vue 设计风格，提供增强的功能特性。

## 特性

- 📅 **多种选择器类型** - DatePicker、RangePicker、MonthPicker、WeekPicker
- 🎯 **预设快捷选项** - 支持自定义预设范围，快速选择常用日期
- 🔄 **双日期库支持** - 同时支持 moment.js 和 dayjs
- 📆 **灵活的选择模式** - date / week / month / quarter / year
- ✅ **表单状态集成** - 支持 error / warning / success 验证状态
- 🎨 **可定制外观** - 无边框模式、自定义弹出位置
- 🌍 **国际化** - 内置 50+ 种语言支持
- 📝 **TypeScript** - 完整的类型定义文件

## 安装

```bash
# 使用 npm
npm install @wangxinowo/vue-datepicker-next moment

# 使用 yarn
yarn add @wangxinowo/vue-datepicker-next moment

# 使用 pnpm
pnpm add @wangxinowo/vue-datepicker-next moment
```

## 快速开始

### 全局注册

```javascript
import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-cn';  // 导入中文语言包
import VueDatepickerNext from '@wangxinowo/vue-datepicker-next';
import '@wangxinowo/vue-datepicker-next/dist/vue-datepicker-next.min.css';

// 设置 moment 全局语言为中文（必须，否则月份等会显示英文）
moment.locale('zh-cn');

Vue.use(VueDatepickerNext);

// 组件将自动注册为：
// <a-date-picker>
// <a-range-picker>
// <a-month-picker>
// <a-week-picker>
```

### 局部注册

```javascript
import { DatePicker, RangePicker, MonthPicker, WeekPicker } from '@wangxinowo/vue-datepicker-next';
import '@wangxinowo/vue-datepicker-next/dist/vue-datepicker-next.min.css';

export default {
  components: {
    ADatePicker: DatePicker,
    ARangePicker: RangePicker,
    AMonthPicker: MonthPicker,
    AWeekPicker: WeekPicker,
  },
};
```

## 使用示例

### 基础 DatePicker

```html
<template>
  <div>
    <a-date-picker
      v-model="date"
      placeholder="选择日期"
      @change="onChange"
    />
    <p>选中日期: {{ date ? date.format('YYYY-MM-DD') : '未选择' }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
  methods: {
    onChange(date, dateString) {
      console.log('选中日期:', date, dateString);
    },
  },
};
</script>
```

### RangePicker 日期范围选择

```html
<template>
  <div>
    <a-range-picker
      v-model="dateRange"
      :placeholder="['开始日期', '结束日期']"
      @change="onRangeChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateRange: [],
    };
  },
  methods: {
    onRangeChange(dates, dateStrings) {
      console.log('日期范围:', dates, dateStrings);
    },
  },
};
</script>
```

### 预设快捷选项 (presets)

```html
<template>
  <a-range-picker v-model="dateRange" :presets="presets" />
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      dateRange: [],
      presets: [
        { label: '今天', value: [moment(), moment()] },
        { label: '本周', value: [moment().startOf('week'), moment().endOf('week')] },
        { label: '本月', value: [moment().startOf('month'), moment().endOf('month')] },
        { label: '最近7天', value: () => [moment().subtract(7, 'days'), moment()] },
        { label: '最近30天', value: () => [moment().subtract(30, 'days'), moment()] },
        { label: '最近3个月', value: () => [moment().subtract(3, 'months'), moment()] },
      ],
    };
  },
};
</script>
```

### 不同选择器模式 (picker)

支持：`date` | `week` | `month` | `quarter` | `year`

```html
<template>
  <div>
    <!-- 年份范围选择 -->
    <a-range-picker picker="year" placeholder="选择年份范围" />

    <!-- 月份范围选择 -->
    <a-range-picker picker="month" placeholder="选择月份范围" />

    <!-- 周范围选择 -->
    <a-range-picker picker="week" placeholder="选择周范围" />

    <!-- 季度范围选择 -->
    <a-range-picker picker="quarter" placeholder="选择季度范围" />
  </div>
</template>
```

### 表单验证状态 (status)

```html
<template>
  <div>
    <a-range-picker status="error" placeholder="错误状态" />
    <a-range-picker status="warning" placeholder="警告状态" />
    <a-range-picker status="success" placeholder="成功状态" />
  </div>
</template>
```

### 弹出位置 (placement)

支持：`bottomLeft` | `bottomRight` | `topLeft` | `topRight`

```html
<template>
  <div>
    <a-range-picker placement="topLeft" />
    <a-range-picker placement="topRight" />
    <a-range-picker placement="bottomRight" />
  </div>
</template>
```

### 无边框模式

```html
<template>
  <a-range-picker :bordered="false" />
</template>
```

### MonthPicker 月份选择

```html
<template>
  <div>
    <a-month-picker v-model="month" placeholder="选择月份" />
    <p>选中月份: {{ month ? month.format('YYYY-MM') : '未选择' }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      month: null,
    };
  },
};
</script>
```

### WeekPicker 周选择

```html
<template>
  <div>
    <a-week-picker v-model="week" placeholder="选择周" />
    <p>选中周: {{ week ? week.format('YYYY-wo') : '未选择' }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      week: null,
    };
  },
};
</script>
```

### 带时间选择

```html
<template>
  <a-date-picker
    v-model="datetime"
    :show-time="{ format: 'HH:mm:ss' }"
    format="YYYY-MM-DD HH:mm:ss"
    placeholder="选择日期时间"
  />
</template>

<script>
export default {
  data() {
    return {
      datetime: null,
    };
  },
};
</script>
```

### 禁用日期

```html
<template>
  <a-date-picker
    :disabled-date="disabledDate"
    placeholder="禁用今天之前的日期"
  />
</template>

<script>
import moment from 'moment';

export default {
  methods: {
    disabledDate(current) {
      // 禁用今天之前的所有日期
      return current && current < moment().startOf('day');
    },
  },
};
</script>
```

## API 文档

### 通用 Props

以下 props 适用于所有日期选择器组件：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value / v-model | 绑定值 | Moment | - |
| defaultValue | 默认日期 | Moment | - |
| defaultPickerValue | 默认面板日期 | Moment | - |
| format | 日期格式化 | string \| string[] \| function | `YYYY-MM-DD` |
| disabled | 禁用 | boolean | false |
| allowClear | 允许清除 | boolean | true |
| placeholder | 输入框占位文本 | string | - |
| size | 尺寸 | `large` \| `default` \| `small` | `default` |
| suffixIcon | 后缀图标 | VNode \| slot | - |
| locale | 国际化配置 | object | - |
| open | 控制弹层显示 | boolean | - |
| disabledDate | 禁用日期 | (currentDate: Moment) => boolean | - |
| showToday | 显示今天按钮 | boolean | true |
| inputReadOnly | 输入框只读 | boolean | false |
| valueFormat | 绑定值的格式 | string | - |
| getCalendarContainer | 浮层容器 | (trigger: HTMLElement) => HTMLElement | - |

### DatePicker Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showTime | 增加时间选择功能 | boolean \| object | false |
| disabledTime | 不可选择的时间 | (date: Moment) => object | - |
| mode | 日期面板的状态 | `time` \| `date` \| `month` \| `year` \| `decade` | `date` |
| renderExtraFooter | 额外的页脚 | () => VNode \| slot | - |

### RangePicker Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value / v-model | 绑定值 | [Moment, Moment] | - |
| placeholder | 输入框占位文本 | [string, string] | ['开始日期', '结束日期'] |
| showTime | 增加时间选择功能 | boolean \| object | false |
| disabledTime | 不可选择的时间 | (dates, partial) => object | - |
| separator | 分隔符 | string \| VNode | `~` |
| mode | 日期面板的状态 | string \| string[] | - |
| renderExtraFooter | 额外的页脚 | () => VNode \| slot | - |
| **presets** | 预设时间范围快捷选择 | Array<{ label: string \| VNode, value: [Moment, Moment] \| () => [Moment, Moment] }> | - |
| **picker** | 选择器类型 | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` |
| **placement** | 弹出位置 | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | `bottomLeft` |
| **status** | 校验状态 | `error` \| `warning` \| `success` \| `validating` | - |
| **bordered** | 是否显示边框 | boolean | true |
| **allowEmpty** | 允许部分为空 | [boolean, boolean] | [false, false] |
| ranges | 预设范围 (已废弃，请用 presets) | object | - |

### MonthPicker Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 输入框占位文本 | string | '请选择月份' |
| monthCellContentRender | 自定义月份单元格内容 | (date: Moment, locale: string) => VNode | - |

### WeekPicker Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 输入框占位文本 | string | '请选择周' |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 日期变化时触发 | (date: Moment \| [Moment, Moment], dateString: string \| [string, string]) |
| panelChange | 日期面板变化时触发 | (value: Moment \| [Moment, Moment], mode: string \| string[]) |
| ok | 点击确定按钮时触发 (showTime 时有效) | (date: Moment \| [Moment, Moment]) |
| openChange | 弹出/关闭日历时触发 | (open: boolean) |
| focus | 获取焦点时触发 | (e: FocusEvent) |
| blur | 失去焦点时触发 | (e: FocusEvent) |
| calendarChange | RangePicker 专属：待选日期变化时触发 | (dates: [Moment, Moment], dateStrings: [string, string]) |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| suffixIcon | 自定义后缀图标 |
| renderExtraFooter | 自定义额外页脚 |
| dateRender | 自定义日期单元格内容 |

## 使用 dayjs 替代 moment

> **注意**：当前版本的日历核心组件仍依赖 moment.js，dayjs 适配器功能不完整。即使配置了 dayjs，月份、星期等名称仍需要 moment 的 locale 支持。建议直接使用 moment.js。

本组件默认使用 moment.js，但也提供了 dayjs 适配器（实验性）：

```javascript
import { setGenerateConfig, dayjsGenerateConfig } from '@wangxinowo/vue-datepicker-next';

// 切换到 dayjs（注意：仍需配置 moment locale）
setGenerateConfig(dayjsGenerateConfig);
```

使用 dayjs 时需要确保安装了必要的插件（组件会自动加载）：

```bash
npm install dayjs
```

## 国际化

组件内置了 50+ 种语言支持。

> **重要提示**：组件内部依赖 moment.js 来显示月份、星期等名称。仅设置组件的 `locale` prop 是不够的，**必须同时设置 moment 的全局语言**，否则会出现中英文混杂的情况。

| 语言 | 代码 | moment locale |
| --- | --- | --- |
| 简体中文 | zh_CN | zh-cn |
| 繁体中文 | zh_TW | zh-tw |
| 英语 (美国) | en_US | en |
| 英语 (英国) | en_GB | en-gb |
| 日语 | ja_JP | ja |
| 韩语 | ko_KR | ko |
| 法语 | fr_FR | fr |
| 德语 | de_DE | de |
| 西班牙语 | es_ES | es |
| 俄语 | ru_RU | ru |
| ... | ... | ... |

### 使用方法

```javascript
// 1. 导入 moment 及对应语言包
import moment from 'moment';
import 'moment/locale/zh-cn';

// 2. 设置 moment 全局语言（必须！）
moment.locale('zh-cn');

// 3. 导入组件 locale 配置
import zhCN from '@wangxinowo/vue-datepicker-next/src/components/date-picker/locale/zh_CN';

// 4. 在组件中使用
<a-date-picker :locale="zhCN" />
```

### 全局配置

```javascript
import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import VueDatepickerNext from '@wangxinowo/vue-datepicker-next';
import zhCN from '@wangxinowo/vue-datepicker-next/src/components/date-picker/locale/zh_CN';

// 必须：设置 moment 全局语言
moment.locale('zh-cn');

Vue.use(VueDatepickerNext, {
  locale: zhCN,
});
```

## TypeScript 支持

本组件提供完整的 TypeScript 类型定义：

```typescript
import { DatePicker, RangePicker, MonthPicker, WeekPicker } from '@wangxinowo/vue-datepicker-next';
import type { DatePickerProps, RangePickerProps, MonthPickerProps, WeekPickerProps } from '@wangxinowo/vue-datepicker-next';
import type { Moment } from 'moment';

// 类型安全的使用
const dateValue: Moment | null = null;
const rangeValue: [Moment, Moment] | null = null;
```

## 更新日志

### 1.0.5 (最新)
- 更新版本和文档增强

### 1.0.3
- 年份和月份范围选择器添加选中范围背景效果

### 1.0.0
- 新增 `presets` 属性，支持预设时间范围快捷选择
- 新增 `picker` 属性，支持 date/week/month/quarter/year 模式
- 新增 `placement` 属性，支持弹出位置配置
- 新增 `status` 属性，支持表单验证状态
- 新增 `bordered` 属性，支持无边框模式
- 新增 `allowEmpty` 属性，允许部分为空
- 优化 RangePicker 输入框样式
- 默认本地化配置改为中文

## 浏览器兼容性

| Chrome | Firefox | Safari | Edge | IE |
| --- | --- | --- | --- | --- |
| ✓ | ✓ | ✓ | ✓ | 11+ |

## 许可证

[MIT](./LICENSE)

## 相关链接

- [GitHub 仓库](https://github.com/wangxinowo/vue-datepicker-next)
- [NPM 包](https://www.npmjs.com/package/@wangxinowo/vue-datepicker-next)
- [Ant Design Vue](https://www.antdv.com/)
