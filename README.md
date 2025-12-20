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

### Basic Usage

```html
<template>
  <div>
    <!-- DatePicker -->
    <date-picker v-model="date" />

    <!-- RangePicker -->
    <range-picker v-model="dateRange" />

    <!-- RangePicker with presets -->
    <range-picker v-model="dateRange" :presets="presets" />
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      date: null,
      dateRange: [],
      presets: [
        { label: 'Today', value: [moment(), moment()] },
        { label: 'This Week', value: [moment().startOf('week'), moment().endOf('week')] },
        { label: 'This Month', value: [moment().startOf('month'), moment().endOf('month')] },
        { label: 'Last 7 Days', value: () => [moment().subtract(7, 'days'), moment()] },
      ],
    };
  },
};
</script>
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
