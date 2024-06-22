<template>
  <div class="wrapper">
    <div class="outer">
      <div class="inner one">
        <span class="item"></span>
        <span class="item"></span>
        <span class="item"></span>
      </div>
      <div class="inner two">
        <span class="item"></span>
        <span class="item"></span>
        <span class="item"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.wrapper {
  height: 50px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 1px 0 red inset;
  .outer {
    width: auto;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: yellowgreen;
    white-space: nowrap;
    .inner {
      position: relative;
      width: 100px;
      height: 100%;
      box-sizing: border-box;
      padding-right: 10px;
      display: inline-flex;
      background: skyblue;
      background-clip: content-box;
      .item {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid blueviolet;
      }
    }
  }
}
</style>
