<template>
  <section class="month-list week-mode">
    <div class="scroll-wrapper" :style="styleConfig">
      <template v-for="weekList in props.list" :key="weekList[0].getDate()">
        <section class="week-date-list">
          <template v-for="date in weekList" :key="date.getDate()">
            <div class="date-item">{{ (date as any).getDate() }}</div>
          </template>
        </section>
      </template>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, unref } from 'vue';
import { useTouchEvent } from '../../utils/useTouchEvent/index';

type List = Date[][]

const props = withDefaults(defineProps<{
  list: List;
}>(), {
  list: () => [],
})

let curDisplayWeek = ref<number>(0);
let eachWeekWidth: number = 0;
let weekCount = props.list.length;

const x = ref<number>(0);
const duration = ref<number>(0);

const styleConfig = computed(() => ({
  'transform': `translateX(${x.value}px)`,
  'transition-duration': `${duration.value}ms`,
}))

// 更新滚动距离
const updateX = (val: number) => {
  x.value = val;
}

// 更新动画持续时间
const updateDuration = (ms: number) => {
 duration.value = ms; 
}

const initCalendarWidth = () => {
  const el = document.querySelector('.calendar-warpper');
  const targetElemt: HTMLElement = document.querySelector('.month-list')!;
  eachWeekWidth = el?.clientWidth ?? 0;
  targetElemt.style.setProperty('--size-width',  `${eachWeekWidth}px`);
}


// 监听 touch 事件
const onTouchEvent = () => {
  const el = document.querySelector('.scroll-wrapper');
  type TouchStartInfo = Partial<Touch & { prevPageX: number, originX: number }>
  let touchStartInfo: TouchStartInfo = {};

  const reset = ()  => {
    touchStartInfo = {};
  }

  // 切换日历
  const onSwitch = (distance: number, originX: number) => {
    if(distance === 0) return;
    const directionMap = {
      SCROLL_PREV: 'scrollPrev',
      SCROLL_NEXT: 'scrollNext',
    };
    const direction = distance > 0 ? directionMap.SCROLL_PREV : directionMap.SCROLL_NEXT; 
    // 滑动距离大于等于日历组件宽度的一半才进行切换
    const isNeedSwitch = Math.abs(distance) >= (eachWeekWidth / 2);
    // 实际需要滚动的距离
    let targetDistance = originX;
    if(isNeedSwitch) {
      // 需要切换，则计算目标块的距离
      switch(direction){
        case directionMap.SCROLL_PREV: {
          // 从左往右滑动
          curDisplayWeek.value = Math.max(--curDisplayWeek.value, 0);
          targetDistance = unref(curDisplayWeek) * eachWeekWidth;
          break;
        }
        case directionMap.SCROLL_NEXT: {
          // 从右往左滑动
          curDisplayWeek.value = Math.min(++curDisplayWeek.value, weekCount - 1);
          targetDistance = -(unref(curDisplayWeek) * eachWeekWidth);
          break;
        }
        default: {
          break;
        }
      }
    }
    updateX(targetDistance);
  }

  const onTouchStart = (e: TouchEvent) => {
    updateDuration(0);
    touchStartInfo = e.changedTouches[0];
    touchStartInfo.prevPageX = touchStartInfo.pageX;
    touchStartInfo.originX = x.value;
  }
 
  const onTouchMove = (e: TouchEvent) => {
    let len = e.changedTouches[0].pageX - (touchStartInfo.prevPageX ?? 0);
    updateX(x.value + len);
    touchStartInfo.prevPageX = e.changedTouches[0].pageX;
  }

  const onTouchEnd = (e: TouchEvent) => {
    let len = e.changedTouches[0].pageX - (touchStartInfo.pageX ?? 0);
    onSwitch(len, touchStartInfo.originX ?? 0);
    updateDuration(300);
    setTimeout(() => {
      reset();
    }, 50);
  }

  // @ts-ignore
  const stop = useTouchEvent(
    el as HTMLElement,
    {
    touchstart: onTouchStart,
    touchmove: onTouchMove,
    touchend: onTouchEnd,
  })
}

onMounted(() => {
  initCalendarWidth();
  onTouchEvent();
})

</script>

<style lang="scss" scoped>
.month-list {
  --size-width: 336px;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .scroll-wrapper {
    position: absolute;
    white-space: nowrap;
    top: 0;
    left: 0;
    width: auto;
    height: 100%;
    .week-date-list {
      position: relative;
      width: var(--size-width);
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      .date-item {
        flex: 1;
        color: #7c86a2;
        font-size: 14px;
        height: 48px;
        padding: 2px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        position: relative;
        &.active {
          background-color: #42a5f5;
          color: #fff;
        }
        &.has-event {
          &::after {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            left: 50%;
            background: rgba(0, 0, 0, 0.3);
            transform: translate(-50%, 130%);
          }
        }
        .top-txt,
        .bottom-txt {
          position: absolute;
          font-size: 16px;
          left: 50%;
          white-space: nowrap;
          transform: translateX(-50%) scale(0.5);
        }
        .top-txt {
          top: -4px;
        }
        .bottom-txt {
          bottom: -4px;
        }
      }
    }
  }
  
}
</style>

<!-- .month-list {
  width: 100%;
  box-sizing: border-box;
  &.week-mode {
    white-space: nowrap;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .month-date-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    .date-item {
      width: calc(100% / 7);
      color: #7c86a2;
      font-size: 14px;
      height: 48px;
      padding: 2px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      &.active {
        background-color: #42a5f5;
        color: #fff;
      }
      &.has-event {
        &::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          left: 50%;
          background: rgba(0, 0, 0, 0.3);
          transform: translate(-50%, 130%);
        }
      }
      .top-txt,
      .bottom-txt {
        position: absolute;
        font-size: 16px;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%) scale(0.5);
      }
      .top-txt {
        top: -4px;
      }
      .bottom-txt {
        bottom: -4px;
      }
    }
  }
  .week-date-list {
    width: 100%;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .date-item {
      flex: 1;
      color: #7c86a2;
      font-size: 14px;
      height: 48px;
      padding: 2px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;
      &.active {
        background-color: #42a5f5;
        color: #fff;
      }
      &.has-event {
        &::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          left: 50%;
          background: rgba(0, 0, 0, 0.3);
          transform: translate(-50%, 130%);
        }
      }
      .top-txt,
      .bottom-txt {
        position: absolute;
        font-size: 16px;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%) scale(0.5);
      }
      .top-txt {
        top: -4px;
      }
      .bottom-txt {
        bottom: -4px;
      }
    }
  }
} -->