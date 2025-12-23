# Vue DatePicker Next

A powerful Vue 2.x DatePicker component based on Ant Design Vue, with enhanced features.

## Features

- 📅 DatePicker, RangePicker, MonthPicker, WeekPicker
- 🎯 Preset ranges with flexible configuration
- 🔄 Support for dayjs/moment.js date libraries
- 🎨 Multiple picker types (date/week/month/quarter/year)
- ✅ Form validation status support
- 🌍 Internationalization support

## Installation

```bash
npm install @wangxinowo/vue-datepicker-next moment
```

## Usage

### Global Registration

```javascript
import Vue from 'vue';
import VueDatepickerNext from '@wangxinowo/vue-datepicker-next';
import '@wangxinowo/vue-datepicker-next/dist/vue-datepicker-next.min.css';

Vue.use(VueDatepickerNext);
```

### Local Registration

```javascript
import { DatePicker, RangePicker } from '@wangxinowo/vue-datepicker-next';
import '@wangxinowo/vue-datepicker-next/dist/vue-datepicker-next.min.css';

export default {
  components: {
    DatePicker,
    RangePicker,
  },
};
```

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
      console.log('DatePicker change:', date, dateString);
    },
  },
};
</script>
```

### RangePicker 日期范围

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
      console.log('RangePicker change:', dates, dateStrings);
    },
  },
};
</script>
```

### RangePicker 预设快捷选项 (presets)

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
      ],
    };
  },
};
</script>
```

### RangePicker 状态 (status)

支持表单验证状态：`error`、`warning`、`success`

```html
<template>
  <div>
    <a-range-picker status="error" />
    <a-range-picker status="warning" />
    <a-range-picker status="success" />
  </div>
</template>
```

### RangePicker 弹出位置 (placement)

支持四个方向：`bottomLeft`、`bottomRight`、`topLeft`、`topRight`

```html
<template>
  <div>
    <a-range-picker placement="topLeft" />
    <a-range-picker placement="topRight" />
  </div>
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

### RangePicker 不同选择器类型 (picker)

支持：`date`、`week`、`month`、`quarter`、`year`

```html
<template>
  <div>
    <a-range-picker picker="year" />
    <a-range-picker picker="month" />
    <a-range-picker picker="week" />
  </div>
</template>
```

### 无边框模式 (bordered)

```html
<template>
  <a-range-picker :bordered="false" />
</template>
```

## Using dayjs instead of moment

```javascript
import { setGenerateConfig, dayjsGenerateConfig } from '@wangxinowo/vue-datepicker-next';

// Switch to dayjs
setGenerateConfig(dayjsGenerateConfig);
```

## RangePicker Props (New in 1.0.0)

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| presets | Preset ranges for quick selection | Array | - |
| picker | Picker type | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` |
| placement | Popup position | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | `bottomLeft` |
| status | Validation status | `error` \| `warning` \| `success` | - |
| bordered | Whether has border | boolean | true |
| allowEmpty | Allow partial empty | [boolean, boolean] | [false, false] |

## License

MIT
