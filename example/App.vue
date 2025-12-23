<template>
  <div id="app">
    <h1>Vue DatePicker Next 示例</h1>

    <div class="demo-section">
      <h2>基础 DatePicker</h2>
      <a-date-picker
        v-model="date1"
        placeholder="选择日期"
        @change="onChange"
      />
      <p>选中日期: {{ date1 ? date1.format('YYYY-MM-DD') : '未选择' }}</p>
    </div>

    <div class="demo-section">
      <h2>RangePicker 日期范围</h2>
      <a-range-picker
        v-model="dateRange"
        :placeholder="['开始日期', '结束日期']"
        @change="onRangeChange"
      />
      <p>选中范围: {{ formatRange(dateRange) }}</p>
    </div>

    <div class="demo-section">
      <h2>RangePicker 预设快捷选项 (presets)</h2>
      <a-range-picker
        v-model="dateRange2"
        :presets="presets"
        @change="onRangeChange2"
      />
      <p>选中范围: {{ formatRange(dateRange2) }}</p>
    </div>

    <div class="demo-section">
      <h2>RangePicker 状态 (status)</h2>
      <div class="status-demos">
        <div>
          <label>Error:</label>
          <a-range-picker status="error" />
        </div>
        <div>
          <label>Warning:</label>
          <a-range-picker status="warning" />
        </div>
        <div>
          <label>Success:</label>
          <a-range-picker status="success" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>RangePicker 弹出位置 (placement)</h2>
      <div class="placement-demos">
        <a-range-picker placement="topLeft" :placeholder="['topLeft', '']" />
        <a-range-picker placement="topRight" :placeholder="['topRight', '']" />
      </div>
    </div>

    <div class="demo-section">
      <h2>MonthPicker 月份选择</h2>
      <a-month-picker
        v-model="month"
        placeholder="选择月份"
      />
      <p>选中月份: {{ month ? month.format('YYYY-MM') : '未选择' }}</p>
    </div>

    <div class="demo-section">
      <h2>WeekPicker 周选择</h2>
      <a-week-picker
        v-model="week"
        placeholder="选择周"
      />
      <p>选中周: {{ week ? week.format('YYYY-wo') : '未选择' }}</p>
    </div>

    <div class="demo-section">
      <h2>RangePicker 不同选择器类型 (picker)</h2>
      <div class="picker-demos">
        <div>
          <label>年份:</label>
          <a-range-picker picker="year" />
        </div>
        <div>
          <label>月份:</label>
          <a-range-picker picker="month" />
        </div>
        <div>
          <label>周:</label>
          <a-range-picker picker="week" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>无边框模式 (bordered)</h2>
      <a-range-picker :bordered="false" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'App',
  data() {
    return {
      date1: null,
      dateRange: [],
      dateRange2: [],
      month: null,
      week: null,
      presets: [
        { label: '今天', value: [moment(), moment()] },
        { label: '本周', value: [moment().startOf('week'), moment().endOf('week')] },
        { label: '本月', value: [moment().startOf('month'), moment().endOf('month')] },
        { label: '最近7天', value: () => [moment().subtract(7, 'days'), moment()] },
        { label: '最近30天', value: () => [moment().subtract(30, 'days'), moment()] },
      ],
    };
  },
  methods: {
    onChange(date, dateString) {
      console.log('DatePicker change:', date, dateString);
    },
    onRangeChange(dates, dateStrings) {
      console.log('RangePicker change:', dates, dateStrings);
    },
    onRangeChange2(dates, dateStrings) {
      console.log('RangePicker2 change:', dates, dateStrings);
    },
    formatRange(range) {
      if (!range || range.length !== 2 || !range[0] || !range[1]) {
        return '未选择';
      }
      return `${range[0].format('YYYY-MM-DD')} ~ ${range[1].format('YYYY-MM-DD')}`;
    },
  },
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 10px;
}

h2 {
  color: #333;
  font-size: 16px;
  margin-top: 0;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.demo-section p {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.status-demos,
.placement-demos,
.picker-demos {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.status-demos > div,
.picker-demos > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-demos label,
.picker-demos label {
  font-weight: 500;
  min-width: 60px;
}
</style>
