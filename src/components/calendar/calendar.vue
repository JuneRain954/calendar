<template>
  <!-- <Calendar
    backgroundText
    class-name="select-mode"
    mode="week"
  /> -->
  <div class="calendar-warpper">
    <section class="week-header">
      <template v-for="item in weekHeader" :key="item.value">
        <span class="week-desc">{{ item.label }}</span>
      </template>
    </section>
    <!-- 月视图模式 -->
    <template v-if="isMonthMode">
      <MonthList :list="monthList" />
    </template>

    <!-- 周视图模式 -->
    <template v-if="isWeekMode">
      <WeekList :list="weekList" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import MonthList from './month-list.vue';
import WeekList from './week-list.vue';


// import Calendar from 'mpvue-calendar';

type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Mode = 'week' | 'month';

const props = withDefaults(defineProps<{
  mode?: Mode;
  firstDayOfWeek?: FirstDayOfWeek;
  minDate?: Date;
  maxDate?: Date;
}>(), {
  mode: 'week',
  firstDayOfWeek: 0,
  minDate: () => new Date(),
  maxDate: () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
});

const weekHeaderDesc = ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'];

// 创建日历的周描述列表
const createWeekHeader = () => {
  const weekDescMap = {
    '日': 0,
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
  };
  const list = weekHeaderDesc.slice(props.firstDayOfWeek, props.firstDayOfWeek + 7);
  return list.map((v) => ({ label: v, value: weekDescMap[v as keyof typeof weekDescMap] }));
}

// 通过星期几来判断获取某天在周描述列表中的对应下标
const findIndexInWeekHeaderByDay = (d: Date): number => {
  return weekHeader.value.findIndex(v => v.value === d.getDay());
}

// 获取某一周后面的空缺日期数量
const getWeekGapDateCountOfEnd = (d: Date) => {
  const i = findIndexInWeekHeaderByDay(d);
  return 7 - i - 1;
};

// 获取某一天在当前周前面的空缺日期列表
const getWeekGapDateListOfHead = (d: Date) => {
  let list: Date[] = []
  const weekGapDateCountOfHead = findIndexInWeekHeaderByDay(d);
  if(weekGapDateCountOfHead){
    for(let i = weekGapDateCountOfHead; i > 0; --i){
      list.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i));
    }
  }
  return list;
}

// 获取某一天在当前周后面的空缺日期列表
const getWeekGapDateListOfEnd = (d: Date) => {
  let list: Date[] = [];
  const weekGapDateCountOfEnd = getWeekGapDateCountOfEnd(d);
  if(weekGapDateCountOfEnd){
    const createDate = (i: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    list = Array.from(Array(weekGapDateCountOfEnd), (_, i) => createDate(i + 1));
  }
  return list;
};

// 创建日期数据
const createDateList = () => {
  const { minDate, maxDate } = props;
  let data: Record<string, Date[]> = {}
  let d = new Date(minDate)
  let endDate = new Date(maxDate);
  endDate.setDate(endDate.getDate() + 1);
  do {
    const key: string = `${d.getFullYear()}/${d.getMonth() + 1}`;
    if(!data[key]) data[key] = [];
    data[key].push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setDate(d.getDate() + 1);
  }while(d.toLocaleDateString() !== endDate.toLocaleDateString())
  return data;
}

const weekHeader = ref(createWeekHeader());
const dateList = ref(createDateList());
const isMonthMode = computed(() => props.mode === 'month');
const isWeekMode = computed(() => props.mode === 'week');

// 月视图日期列表
const monthList = computed((): Record<string, any> => {
  const fillEveryWeek = (obj: Record<string, any>, [key, val]: [string, Date[]]) => {
    const firstWeekGapDateList = getWeekGapDateListOfHead(val[0]);
    const lastWeekGapDateList = getWeekGapDateListOfEnd(val[val.length - 1]);
    obj[key] = [...firstWeekGapDateList, ...val, ...lastWeekGapDateList];
    return obj;
  }
  return Object.entries(unref(dateList)).reduce(fillEveryWeek, {});
})

// 周视图日期列表
const weekList = computed(() => {
  let data: Date[][] = []
  // @ts-ignore
  const concatAllDate = (list: Date[], [key, val]: [string, Date[]]) => [...list, ...val];
  let list = Object.entries(unref(dateList)).reduce(concatAllDate, []);
  const firstWeekGapDateList = getWeekGapDateListOfHead(list[0]);
  const lastWeekGapDateList = getWeekGapDateListOfEnd(list[list.length - 1]);
  list = [...firstWeekGapDateList, ...list, ...lastWeekGapDateList];
  // 每周7天为一组进行分割
  while(list.length) {
    data.push(list.splice(0, 7));
  }
  return data;
})

</script>

<style lang="scss" scoped>
.calendar-warpper {
  width: 100%;
  margin-top: 50px;
  .week-header {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
    .week-desc {
      flex: 1;
      color: #6b7897;
      font-size: 12px;
    }
  }

}
</style>
