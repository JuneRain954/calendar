<template>
  <section class="year-wrapper">
    <template v-for="monthList in props.list" :key="monthList[0].getDate()">
      <section class="month-list">
        <div class="month-date-list">
          <template v-for="item in monthList" :key="item.getDate()" >
            <div class="date-item">{{ (item as any).getDate() }}</div>
          </template>
        </div>
      </section>
    </template>
  </section>
</template>

<script lang="ts" setup>
interface List {
  [key: string]: Date[];
}

const props = withDefaults(defineProps<{
  list: List;
}>(), {
  list: () => ({})
})

</script>

<style lang="scss" scoped>
.year-wrapper {
  white-space: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .month-list {
    display: inline-block;
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
  }
}
</style>
