<template>
  <div class="calendar-container">
    <!-- 顶部周描述列表 -->
    <section class="week-desc-container">
      <template v-for="item in weekDescList" :key="item.value">
        <span class="week-desc">{{ item.label }}</span>
      </template>
    </section>
    <!-- 日期列表 -->
    <section :class="['scroll-container', `${props.mode}-mode`]">
      <div class="scroll-track">
        <template v-for="(monthList, key) in dateData" :key="key">
          <section class="month-list">
            <template v-for="weekList in monthList" :key="weekList[0].getDate()">
              <section class="week-date-list">
                <template v-for="date in weekList" :key="date.getDay()">
                  <div class="date">
                    {{ date.getDate() }}
                  </div>
                </template>
              </section>
            </template>
          </section>
        </template>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, computed } from 'vue';

type Mode = 'week' | 'month';
type FirstDateOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 定义父组件传值
const props = withDefaults(defineProps<{
  mode?: Mode;
  firstDateOfWeek?: FirstDateOfWeek;
  minDate?: Date;
  maxDate?: Date;
}>(), {
  mode: 'week',
  firstDateOfWeek: 0,
  minDate: () => new Date(),
  maxDate: () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
  },
})

// 创建周描述列表
const createWeekDescList = () => {
  const { firstDateOfWeek } = props;
  const descMap: Record<string, FirstDateOfWeek> = {
    '日': 0,
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
  };

  const baseList = weekDescBaseList.slice(firstDateOfWeek, firstDateOfWeek + 7);
  const createDescItem = (label: string) => ({ label, value: descMap[label] });
  return baseList.map(createDescItem);
};

// 创建基础日期列表
const createBaseDateData = () => {
  const { minDate, maxDate } = props;
  const d = new Date(minDate);
  const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 1);
  const baseDateData: Record<string, Date[]> = {};
  do {
    const key = `${d.getFullYear()}/${d.getMonth() + 1}`;
    if(!baseDateData[key]) baseDateData[key] = [];
    baseDateData[key].push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setDate(d.getDate() + 1);
  }while(d.toLocaleDateString() !== endDate.toLocaleDateString())
  return baseDateData;
};

// 根据周几来寻找指定日期对象在当前周描述列表的下标
const findIndexInWeekByDate = (d: Date) => {
  return weekDescList.value.findIndex(v => v.value === d.getDay());
}


// 获取当前周内比指定日期对象早的日期数组
const getGapDateListOfHead = (d: Date) => {
  let gapDateList: Date[] = [];
  const gapDateCountOfHead = findIndexInWeekByDate(d);
  if(gapDateCountOfHead){
    for(let i = gapDateCountOfHead; i > 0; --i){
      gapDateList.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i));
    }
  }
  return gapDateList;
}

// 获取当前周内比指定日期对象晚的日期数组
const getGapDateListOfEnd = (d: Date) => {
  let gapDateList: Date[] = [];
  const i = findIndexInWeekByDate(d);
  const gapDateCountOfEnd = 7 - i - 1;
  if(gapDateCountOfEnd) {
    const initList = (_: any, i: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i + 1);
    gapDateList = Array.from(Array(gapDateCountOfEnd), initList);
  }
  return gapDateList;
}

// 填充日期数组，使得每组都是一周7天
const fillMonthDateList = (list: Date[]) => {
  let targetList: Date[][] = [];
  // 填充首周
  const gapDateListOfHead = getGapDateListOfHead(list[0]);
  // 填充末周
  const gapDateListOfEnd = getGapDateListOfEnd(list[list.length - 1]);
  // 拼接为一个数组
  const tempList = [...gapDateListOfHead, ...list, ...gapDateListOfEnd];
  // 每7个为一组分割
  while(tempList.length){
    targetList.push(tempList.splice(0, 7));
  }
  return targetList;
}

// 创建月视图模式下的日期数据
const createMonthViewDateData = () => {
  let dateData: Record<string, Date[][]> = {};
  const getMonthDateList = (data: Record<string, Date[][]>, [key, list]: [string, Date[]]) => {
    data[key] = fillMonthDateList(list);
    return data;
  }
  dateData = Object.entries(unref(baseDateData)).reduce(getMonthDateList, {});
  return dateData;
}


// 创建周视图模式下的日期数据
const createWeekViewDateData = () => {
  const { minDate: b, maxDate: e } = props;
  const concatAllDate = (toList: Date[], fromList: Date[]) => [...toList, ...fromList];
  const allDateList = Object.values(unref(baseDateData)).reduce(concatAllDate, []);
  const targetAllDateList = fillMonthDateList(allDateList);
  const key = `${b.getFullYear()}/${b.getMonth() + 1}-${e.getFullYear()}/${e.getMonth() + 1}`;
  return { [key]: targetAllDateList };
}

const weekDescBaseList = ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'];
const weekDescList = ref(createWeekDescList());
const baseDateData = ref(createBaseDateData());
const dateData = computed(() => {
  return props.mode === 'month' ? createMonthViewDateData() : createWeekViewDateData();
});

</script>

<style lang="scss" scoped>
.calendar-container {
  --calendar-width: 311.33px;
  width: 100%;
  box-sizing: border-box;
  .week-desc-container {
    width: 100%;
    padding-bottom: 4px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
    .week-desc {
      height: 32px;
      line-height: 32px;
      flex: 1;
      font-size: 12px;
    }
  }
  .scroll-container {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // 月视图模式
    &.month-mode {
      .scroll-track {
        position: relative;
        display: inline-block;
        white-space: nowrap;
        .month-list {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .week-date-list {
            width: 311.33px;
          }
        }
      }
    }
    // 周视图模式
    &.week-mode {
      height: 48px;
      .scroll-track {
        position: relative;
        display: inline-block;
        .month-list {
          width: auto;
          position: relative;
          white-space: nowrap;
          display: inline-block;
          .week-date-list {
            width: 311.33px;
            position: relative;
          }
        }
      }
    }
    .scroll-track {
      .month-list {
        box-sizing: border-box;
        .week-date-list {
          width: 100%;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 14px;
          .date {
            height: 48px;
            line-height: 48px;
            flex: 1;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
}
</style>

